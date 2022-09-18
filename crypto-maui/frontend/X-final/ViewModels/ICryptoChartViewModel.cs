namespace MauiCrypto;

interface ICryptoChartViewModel
{
	string ChartLineColor { get; }
	string XAxisLabelStringFormat { get; }
	IReadOnlyList<CryptoPriceHistoryModel> PriceHistory { get; }
}

