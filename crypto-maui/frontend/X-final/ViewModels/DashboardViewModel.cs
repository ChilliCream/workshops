using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Net;
using CommunityToolkit.Mvvm.Input;
using StrawberryShake;

namespace MauiCrypto;

partial class DashboardViewModel : BaseViewModel
{
	readonly CryptoGraphQLService _cryptoGraphQLService;

	public DashboardViewModel(IDispatcher dispatcher, CryptoGraphQLService cryptoGraphQLService) : base(dispatcher)
	{
		_cryptoGraphQLService = cryptoGraphQLService;
		SubscribeOnPriceChangeSession = cryptoGraphQLService.SubscribeOnPriceChange(OnPriceChange);

		AssetCollection.CollectionChanged += HandleAssetCollectionChanged;
	}

	public IReadOnlyList<ObservableCryptoModel> AssetList => AssetCollection;

	public IReadOnlyList<ObservableCryptoModel> TopLosersList => AssetList
																	.OrderBy(x => x.Price?.Change24Hour)
																	.Take(TopPerformersView.NumberOfPerformers)
																	.ToList();

	public IReadOnlyList<ObservableCryptoModel> TopGainersList => AssetList
																	.OrderByDescending(x => x.Price?.Change24Hour)
																	.Take(TopPerformersView.NumberOfPerformers)
																	.ToList();

	public ObservableCollection<ObservableAssetPriceHistoryModel> NamedCryptoPriceHistoryList { get; } = new();

	[RelayCommand]
	async Task RefreshCollectionView(CancellationToken token)
	{
		try
		{
			AssetCollection.Clear();
			NamedCryptoPriceHistoryList.Clear();

			await foreach (var node in _cryptoGraphQLService.GetAssestsQuery(token).ConfigureAwait(false))
			{
				var stockTickerModel = new ObservableCryptoModel(node);
				Dispatcher.Dispatch(() => AssetCollection.Add(stockTickerModel));
			}
		}
		catch (Exception e) when (e is HttpRequestException or WebException or GraphQLClientException)
		{
			OnHttpClientError(e.Message);
		}
	}

	[RelayCommand(AllowConcurrentExecutions = true)]
	async Task UpdateCarouselViewChart(ObservableAssetPriceHistoryModel assetPriceHistoryModel)
	{
		var observableHistoryModel = NamedCryptoPriceHistoryList.FirstOrDefault(x => x.Symbol == assetPriceHistoryModel.Symbol);

		if (observableHistoryModel is null || observableHistoryModel.PriceHistory.Any())
			return;

		try
		{
			var cts = new CancellationTokenSource(TimeSpan.FromMinutes(1));
			await foreach (var priceHistory in _cryptoGraphQLService.GetPriceHistory(observableHistoryModel.Symbol, cts.Token, ChangeSpan.Day).ConfigureAwait(false))
			{
				Dispatcher.Dispatch(() => observableHistoryModel.PriceHistory.Add(new CryptoPriceHistoryModel(priceHistory)));
			}
		}
		catch
		{
			Dispatcher.Dispatch(observableHistoryModel.PriceHistory.Clear);
		}
	}

	async void HandleAssetCollectionChanged(object? sender, NotifyCollectionChangedEventArgs e)
	{
		OnPropertyChanged(nameof(AssetList));
		OnPropertyChanged(nameof(TopLosersList));
		OnPropertyChanged(nameof(TopGainersList));

		await Task.Yield();

		foreach (var cryptoModel in e.NewItems?.Cast<ObservableCryptoModel>() ?? Array.Empty<ObservableCryptoModel>())
		{
			Dispatcher.Dispatch(() =>
			{
				NamedCryptoPriceHistoryList.Add(new ObservableAssetPriceHistoryModel(cryptoModel.Symbol,
													cryptoModel.Color,
													cryptoModel.Price?.LastPrice ?? 0,
													cryptoModel.Price?.Change24Hour ?? 0));
			});
		}
	}
}