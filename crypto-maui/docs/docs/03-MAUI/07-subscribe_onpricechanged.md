# Subscribe to OnPriceChanged

We're almost done! But what if the price of the Crypto changes while we're looking the app? Right now the app only retrieves the price once. 

Let's subscribe to OnPriceChanged in the Backend GraphQL API to ensure we always see the latest data!

## 1. SubscribeOnPriceChange.graphql

Let's first see how **StrawberryShake** automatically generates C# code based on our `*.graphql` files

1. In Visual Studio, open **Services/GraphQL/Operations/GetAssetPriceHistory.graphql**
2. Here's a breakdown of how **Strawberry Shake** turns this GraphQL query into C# code:

    | GetAssetPriceHistory.graphql | Strawberry Shake |
    | ----------------------  | ---------------- |
    | `subscription SubscribeOnPriceChange`| Generates a Method, `SubscribeOnPriceChange.Watch()` |
    | `onPriceChange` | Generates an interface, `interface ISubscribeOnPriceChange_OnPriceChange` |
    | `change` | Generates an interface, `interface ISubscribeOnPriceChange_OnPriceChange_Change` |

## 2. Add SubscribeOnPriceChange Logic

1. In Visual Studio, open **Services/GraphQL/GraphQLService**
2. In **GraphQLService**, update the `SubscribeOnPriceChange` method with the following code:

    ```cs
    public IDisposable SubscribeOnPriceChange(Action<IOperationResult<ISubscribeOnPriceChangeResult>> onSubscribe) => _cryptoClient.SubscribeOnPriceChange.Watch().Subscribe(onSubscribe); // Each time OnPriceChange changes, it wil execute `onSubscribe`
    ```

