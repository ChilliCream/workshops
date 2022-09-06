using System.Collections.Specialized;

namespace MauiCrypto;

class ScreenerViewModel : BaseViewModel
{
	public ScreenerViewModel(CryptoGraphQLService cryptoGraphQLService)
	{
		SubscribeOnPriceChangeSession ??= cryptoGraphQLService.SubscribeOnPriceChange(OnPriceChange);
		AssetCollection.CollectionChanged += HandleAssetCollectionChanged;
	}

	public IReadOnlyList<ObservableCryptoModel> AssetList => AssetCollection;

	void HandleAssetCollectionChanged(object? sender, NotifyCollectionChangedEventArgs e)
	{
		OnPropertyChanged(nameof(AssetList));
	}
}