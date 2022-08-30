using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using StrawberryShake;
using StrawberryShake.Transport.WebSockets;

namespace MauiCrypto;

sealed partial class DashboardViewModel : BaseViewModel, IDisposable
{
	readonly IDisposable _subscribeOnPriceChangeSession;
	readonly CryptoGraphQLService _cryptoGraphQLService;

	public DashboardViewModel(CryptoGraphQLService cryptoGraphQLService, MauiCryptoClient client)
	{
		_cryptoGraphQLService = cryptoGraphQLService;

		_subscribeOnPriceChangeSession = client.SubscribeOnPriceChange.Watch().Subscribe(result =>
		{
			result.EnsureNoErrors();

			if (result?.Data?.OnPriceChange is ISubscribeOnPriceChange_OnPriceChange_AssetPrice assetPrice
				&& AssetCollection.FirstOrDefault(x => x.Symbol == assetPrice.Symbol) is StockTickerModel node
				&& assetPrice.LastPrice	!= node.Price?.LastPrice)
			{
				node.Price = new StockTickerPriceModel
				{
					LastPrice = assetPrice.LastPrice,
					Change24Hour = assetPrice.Change24Hour
				};
			}
		});
	}

	~DashboardViewModel() => Dispose();

	public ObservableCollection<StockTickerModel> AssetCollection { get; } = new();

	public void Dispose()
	{
		GC.SuppressFinalize(this);
		_subscribeOnPriceChangeSession.Dispose();
	}

	[RelayCommand]
	async Task RefreshCollectionView(CancellationToken token)
	{
		AssetCollection.Clear();

		await foreach (var node in _cryptoGraphQLService.GetAssestsQuery(token).ConfigureAwait(false))
		{
			var stockTickerModel = new StockTickerModel(node);
			AssetCollection.Add(stockTickerModel);
		}
	}
}