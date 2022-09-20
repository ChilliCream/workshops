using System.Collections.ObjectModel;

namespace MauiCrypto;

class ObservableAssetPriceHistoryModel : ICryptoChartModel
{
	public ObservableAssetPriceHistoryModel(
		string symbol,
		string color,
		double latestPrice,
		double percentChange)
	{
		Color = Color.FromArgb(color);
		Symbol = symbol;
		LatestPrice = latestPrice;
		PercentChange = percentChange;
	}

	public string ChartLineColor => Color.ToArgbHex();

	public Color Color { get; }
	public string Symbol { get; }
	public double LatestPrice { get; }
	public double PercentChange { get; }
	public ObservableCollection<CryptoPriceHistoryModel> PriceHistory { get; } = new();

	string ICryptoChartModel.XAxisLabelStringFormat => "h:mm tt";
	IEnumerable<CryptoPriceHistoryModel> ICryptoChartModel.PriceHistory => PriceHistory;
}

