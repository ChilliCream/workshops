using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace MauiCrypto;

partial class AssetChartViewModel : BaseViewModel, IQueryAttributable, ICryptoChartViewModel
{
	readonly CryptoGraphQLService _cryptoGraphQLService;

	[ObservableProperty]
	string _assetImageUrl = string.Empty,
			_assetName = string.Empty,
			_assetSymbol = string.Empty,
			_assetColor = string.Empty;

	[ObservableProperty]
	DateTimeOffset _minDateTime, _maxDateTime;

	[ObservableProperty]
	double _xAxisInterval, _yAxisInterval;

	public AssetChartViewModel(IDispatcher dispatcher, CryptoGraphQLService cryptoGraphQLService) : base(dispatcher)
	{
		_cryptoGraphQLService = cryptoGraphQLService;
	}

	public ObservableCollection<CryptoPriceHistoryModel> PriceHistory { get; } = new();

	IReadOnlyList<IGetAssetPriceHistoryQuery_AssetBySymbol_Price_Change_History_Nodes> ICryptoChartViewModel.PriceHistory => PriceHistory.Cast<IGetAssetPriceHistoryQuery_AssetBySymbol_Price_Change_History_Nodes>().ToList();

	[RelayCommand]
	async Task UpdatePriceHistory(CancellationToken token)
	{
		PriceHistory.Clear();

		await foreach (var node in _cryptoGraphQLService.GetPriceHistory(AssetSymbol, token).ConfigureAwait(false))
		{
			Dispatcher.Dispatch(() => PriceHistory.Add(new CryptoPriceHistoryModel(node)));
		}
	}

	void IQueryAttributable.ApplyQueryAttributes(IDictionary<string, object> query)
	{
		var assetName = (string)query[nameof(AssetName)];
		var assetColor = (string)query[nameof(AssetColor)];
		var assetSymbol = (string)query[nameof(AssetSymbol)];
		var assetImageUrl = (string)query[nameof(AssetImageUrl)];

		AssetName = assetName;
		AssetColor = assetColor;
		AssetSymbol = assetSymbol;
		AssetImageUrl = assetImageUrl;
	}
}

