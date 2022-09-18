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
		SubscribeOnPriceChangeSession ??= cryptoGraphQLService.SubscribeOnPriceChange(OnPriceChange);

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

	[RelayCommand]
	async Task RefreshCollectionView(CancellationToken token)
	{
		try
		{
			AssetCollection.Clear();

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

	void HandleAssetCollectionChanged(object? sender, NotifyCollectionChangedEventArgs e)
	{
		OnPropertyChanged(nameof(AssetList));
		OnPropertyChanged(nameof(TopLosersList));
		OnPropertyChanged(nameof(TopGainersList));
	}
}