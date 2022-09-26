# Subscribe to OnPriceChanged

We're almost done! But what if the price of the crypto asset changes after we launch the app? Right now the app only retrieves the price once. 

Let's subscribe to `OnPriceChanged` in the Backend GraphQL API to ensure we always see the latest data!

## 1. SubscribeOnPriceChange.graphql

Let's first see how **StrawberryShake** automatically generates C# code based on our `*.graphql` files

1. In **Visual Studio**, open **Services/GraphQL/Operations/GetAssetPriceHistory.graphql**
2. Here's a breakdown of how **Strawberry Shake** turns this GraphQL query into C# code:

    | GetAssetPriceHistory.graphql | Strawberry Shake |
    | ----------------------  | ---------------- |
    | `subscription SubscribeOnPriceChange`| Generates a Method, `SubscribeOnPriceChange.Watch()` |
    | `onPriceChange` | Generates an interface, `interface ISubscribeOnPriceChange_OnPriceChange` |
    | `change` | Generates an interface, `interface ISubscribeOnPriceChange_OnPriceChange_Change` |

## 2. Add SubscribeOnPriceChange Logic

1. In **Visual Studio**, open **Services/GraphQL/GraphQLService**
2. In **GraphQLService**, update the `SubscribeOnPriceChange` method with the following code:

    ```cs
    public IDisposable SubscribeOnPriceChange(Action<IOperationResult<ISubscribeOnPriceChangeResult>> onNext)
    {
        // Each time OnPriceChange changes, it wil execute `onNext`
        return _cryptoClient.SubscribeOnPriceChange.Watch().Subscribe(onNext); // returns an IDisposable that will automatically be unsubscribed when disposed
    } 
    ```

## 3. Subscribe ScreenerViewModel to CryptoGraphQLService.SubscribeOnPriceChange

1. In **Visual Studio**, open **ViewModels/ScreenerViewModel**
2. In **ScreenerViewModel** add the method `OnNext`:

    ```cs
    using System.Collections.Specialized;
    using System.Net;
    using CommunityToolkit.Mvvm.ComponentModel;
    using StrawberryShake;

    namespace MauiCrypto;

    partial class ScreenerViewModel : BaseViewModel
    {
        public ScreenerViewModel(IDispatcher dispatcher, CryptoGraphQLService cryptoGraphQLService) : base(dispatcher)
        {
            BaseViewModel.AssetCollection.CollectionChanged += HandleCollectionChanged;
        }

        public IReadOnlyList<ObservableCryptoModel> AssetList => BaseViewModel.AssetCollection.ToList();

        void HandleCollectionChanged(object? sender, NotifyCollectionChangedEventArgs e)
        {
            OnPropertyChanged(nameof(AssetList));
        }

        void OnNext(IOperationResult<ISubscribeOnPriceChangeResult> result)
        {
            try
            {
                result.EnsureNoErrors(); // Throws a GraphQLClientException if the GraphQL Server returns an error

                if (result?.Data?.OnPriceChange is ISubscribeOnPriceChange_OnPriceChange_AssetPrice assetPrice // Ensures result?.Data?.OnPriceChange is not null
                    && AssetCollection.FirstOrDefault(x => x.Symbol == assetPrice.Symbol) is ObservableCryptoModel node) // Ensures the symbol exists in `AssetCollection`
                {
                    node.Price = new ObservableCryptoPriceModel // Updates the price 
                    {
                        LastPrice = assetPrice.LastPrice,
                        Change24Hour = assetPrice.Change24Hour
                    };
                }
            }
            catch (Exception e) when (e is HttpRequestException or WebException or GraphQLClientException)
            {
                OnHttpClientError(e.Message);
            }
        }
    }
    ```

3. In **ScreenerViewModel**, subscribe to `CryptoGraphQLService.SubscribeOnPriceChange()`:

    ```cs
    using System.Collections.Specialized;
    using System.Net;
    using CommunityToolkit.Mvvm.ComponentModel;
    using StrawberryShake;

    namespace MauiCrypto;

    partial class ScreenerViewModel : BaseViewModel
    {
        public ScreenerViewModel(IDispatcher dispatcher, CryptoGraphQLService cryptoGraphQLService) : base(dispatcher)
        {
            SubscribeOnPriceChangeSession = cryptoGraphQLService.SubscribeOnPriceChange(result => OnNext(result));
            BaseViewModel.AssetCollection.CollectionChanged += HandleCollectionChanged;
        }

        public IReadOnlyList<ObservableCryptoModel> AssetList => BaseViewModel.AssetCollection.ToList();

        void HandleCollectionChanged(object? sender, NotifyCollectionChangedEventArgs e)
        {
            OnPropertyChanged(nameof(AssetList));
        }

        void OnNext(IOperationResult<ISubscribeOnPriceChangeResult> result)
        {
            try
            {
                result.EnsureNoErrors(); // Throws a GraphQLClientException if the GraphQL Server returns an error

                if (result?.Data?.OnPriceChange is ISubscribeOnPriceChange_OnPriceChange_AssetPrice assetPrice // Ensures result?.Data?.OnPriceChange is not null
                    && AssetCollection.FirstOrDefault(x => x.Symbol == assetPrice.Symbol) is ObservableCryptoModel node) // Ensures the symbol exists in `AssetCollection`
                {
                    node.Price = new ObservableCryptoPriceModel // Updates the price 
                    {
                        LastPrice = assetPrice.LastPrice,
                        Change24Hour = assetPrice.Change24Hour
                    };
                }
            }
            catch (Exception e) when (e is HttpRequestException or WebException or GraphQLClientException)
            {
                OnHttpClientError(e.Message);
            }
        }
    }
    ```
    :::info
    The logic to dispose `SubscribeOnPriceChangeSession` (and thus unsubscribe, closing the websocket) is handled in `BaseViewModel`
    :::

## 3. Verify Subscription Logic

Now that we've added logic to subscribe to `OnPriceChanged`, let's ensure it is working and the app is updating acccordingly

1. In **Visual Studio**, open **ViewModels/ScreenerViewModel.cs**
2. In **ScreenerViewModel**, inside the `OnNext` method, set a breakpoint inside of on the line containing `result.EnsureNoErrors();`
    :::info 
    If you are new to debugging with breakpoints, here is an introduction:
    > - (Windows) https://learn.microsoft.com/visualstudio/debugger/using-breakpoints?view=vs-2022
    > - (macOS) https://learn.microsoft.com/visualstudio/mac/debugging?view=vsmac-2022
    :::
3. In **Visual Studio**, build + deploy the Android app to the Android Emulator
4. In the Android Emulator, navigate to the **Screener** page
5. After opening the **Screener** page, wait for the Visual Studio breakpoint to trigger
    :::info
    If the price change is small, you may not see a visible change on the UI. I.e. if AAVE changed from `170.731` to `170.732`, the UI will continue to display a price of `170.73`.
    :::