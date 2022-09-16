using CommunityToolkit.Mvvm.ComponentModel;

namespace MauiCrypto;

partial class AssetChartViewModel : BaseViewModel, IQueryAttributable, ICryptoChartViewModel
{
	[ObservableProperty]
	string _assetImageUrl = string.Empty,
			_assetName = string.Empty,
			_assetSymbol = string.Empty;

	[ObservableProperty]
	DateTimeOffset _minDateTime, _maxDateTime;

	[ObservableProperty]
	double _xAxisInterval, _yAxisInterval;

	public AssetChartViewModel(IDispatcher dispatcher) : base(dispatcher)
	{

	}

	public IReadOnlyList<CryptoPriceHistoryModel> PriceHistory { get; } = new[]
	{
		new CryptoPriceHistoryModel(DateTimeOffset.Now.Subtract(TimeSpan.FromHours(12)), 10.5),
		new CryptoPriceHistoryModel(DateTimeOffset.Now.Subtract(TimeSpan.FromHours(11)), 12.7),
		new CryptoPriceHistoryModel(DateTimeOffset.Now.Subtract(TimeSpan.FromHours(10)), 13.5),
		new CryptoPriceHistoryModel(DateTimeOffset.Now.Subtract(TimeSpan.FromHours(9)), 11.3),
		new CryptoPriceHistoryModel(DateTimeOffset.Now.Subtract(TimeSpan.FromHours(8)), 13.5),
		new CryptoPriceHistoryModel(DateTimeOffset.Now.Subtract(TimeSpan.FromHours(7)), 14.8),
		new CryptoPriceHistoryModel(DateTimeOffset.Now.Subtract(TimeSpan.FromHours(6)), 9.8),
		new CryptoPriceHistoryModel(DateTimeOffset.Now.Subtract(TimeSpan.FromHours(5)), 14.4),
		new CryptoPriceHistoryModel(DateTimeOffset.Now.Subtract(TimeSpan.FromHours(4)), 12.8),
		new CryptoPriceHistoryModel(DateTimeOffset.Now.Subtract(TimeSpan.FromHours(3)), 13.7),
		new CryptoPriceHistoryModel(DateTimeOffset.Now.Subtract(TimeSpan.FromHours(2)), 14.6),
		new CryptoPriceHistoryModel(DateTimeOffset.Now.Subtract(TimeSpan.FromHours(1)), 15.3),
		new CryptoPriceHistoryModel(DateTimeOffset.Now, 13.1),
	};

	IReadOnlyList<IGetAssetPriceHistoryQuery_AssetBySymbol_Price_Change_History_Nodes> ICryptoChartViewModel.PriceHistory => PriceHistory.Cast<IGetAssetPriceHistoryQuery_AssetBySymbol_Price_Change_History_Nodes>().ToList();

	void IQueryAttributable.ApplyQueryAttributes(IDictionary<string, object> query)
	{
		var assetName = (string)query[nameof(AssetName)];
		var assetSymbol = (string)query[nameof(AssetSymbol)];
		var assetImageUrl = (string)query[nameof(AssetImageUrl)];

		AssetName = assetName;
		AssetSymbol = assetSymbol;
		AssetImageUrl = assetImageUrl;
	}
}

