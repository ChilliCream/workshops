using System;
namespace MauiCrypto;

interface ICryptoChartViewModel
{
	DateTimeOffset MinDateTime { get; }
	DateTimeOffset MaxDateTime { get; }
	double XAxisInterval { get; }
	double YAxisInterval { get; }
	IReadOnlyList<IGetAssetPriceHistoryQuery_AssetBySymbol_Price_Change_History_Nodes> PriceHistory { get; }
}

