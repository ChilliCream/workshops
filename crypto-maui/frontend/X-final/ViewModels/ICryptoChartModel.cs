namespace MauiCrypto;

interface ICryptoChartModel
{
	string ChartLineColor { get; }
	string XAxisLabelStringFormat { get; }
	IEnumerable<CryptoPriceHistoryModel> PriceHistory { get; }
}

