using System;
namespace MauiCrypto;

interface ICryptoChartViewModel
{
	DateTimeOffset MinDateTime { get; }
	DateTimeOffset MaxDateTime { get; }
	double XAxisInterval { get; }
	double YAxisInterval { get; }
	string ChartLineColor { get; }
	string XAxisLabelStringFormat { get; }
	IReadOnlyList<CryptoPriceHistoryModel> PriceHistory { get; }
}

