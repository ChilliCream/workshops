using System.Collections.ObjectModel;
using System.Collections.Specialized;
using CommunityToolkit.Mvvm.Input;
using StrawberryShake;

namespace MauiCrypto;

sealed partial class DashboardViewModel : BaseViewModel, IDisposable
{
	readonly IDisposable _subscribeOnPriceChangeSession;
	readonly CryptoGraphQLService _cryptoGraphQLService;

	public DashboardViewModel(CryptoGraphQLService cryptoGraphQLService)
	{
		_cryptoGraphQLService = cryptoGraphQLService;
		_subscribeOnPriceChangeSession = cryptoGraphQLService.SubscribeOnPriceChange(OnPriceChange);

		AssetCollection.CollectionChanged += HandleAssetCollectionChanged;
	}

	~DashboardViewModel() => Dispose();

	public IReadOnlyList<ObservableCryptoModel> TopLosersList => AssetCollection
																	.OrderBy(x => x.Price?.Change24Hour)
																	.Take(TopPerformersView.NumberOfPerformers)
																	.ToList();

	public IReadOnlyList<ObservableCryptoModel> TopGainersList => AssetCollection
																	.OrderByDescending(x => x.Price?.Change24Hour)
																	.Take(TopPerformersView.NumberOfPerformers)
																	.ToList();

	public ObservableCollection<ObservableCryptoModel> AssetCollection { get; } = new();

	public void Dispose()
	{
		GC.SuppressFinalize(this);
		_subscribeOnPriceChangeSession.Dispose();
	}

	void OnPriceChange(IOperationResult<ISubscribeOnPriceChangeResult> result)
	{
		result.EnsureNoErrors();

		if (result?.Data?.OnPriceChange is ISubscribeOnPriceChange_OnPriceChange_AssetPrice assetPrice
			&& AssetCollection.FirstOrDefault(x => x.Symbol == assetPrice.Symbol) is ObservableCryptoModel node
			&& assetPrice.LastPrice != node.Price?.LastPrice)
		{
			node.Price = new ObservableCryptoPriceModel
			{
				LastPrice = assetPrice.LastPrice,
				Change24Hour = assetPrice.Change24Hour
			};
		}
	}

	[RelayCommand]
	async Task RefreshCollectionView(CancellationToken token)
	{
		AssetCollection.Clear();

		await foreach (var node in _cryptoGraphQLService.GetAssestsQuery(token).ConfigureAwait(false))
		{
			var stockTickerModel = new ObservableCryptoModel(node);
			AssetCollection.Add(stockTickerModel);
		}
	}

	void HandleAssetCollectionChanged(object? sender, NotifyCollectionChangedEventArgs e)
	{
		OnPropertyChanged(nameof(TopLosersList));
		OnPropertyChanged(nameof(TopGainersList));
	}
}