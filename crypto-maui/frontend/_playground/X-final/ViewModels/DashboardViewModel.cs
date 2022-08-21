using CommunityToolkit.Mvvm.ComponentModel;

namespace MauiCrypto;

partial class DashboardViewModel : BaseViewModel
{
	[ObservableProperty]
	IReadOnlyList<StockTickerModel> stockTickerModelList = new List<StockTickerModel>
	{
		new("ABC", 12.34m, 0.01, Colors.Orange),
		new("UAR", 100.34m, -0.05, Colors.Blue),
		new("OIH", 32.5m, -0.32, Colors.Khaki),
		new("LJS", 2.264m, 0.92, Colors.DarkBlue),
		new("SDP", 22.73m, 0.04, Colors.Crimson),
		new("NEQ", 41.32m, 0.07, Colors.PaleGoldenrod),
	};
}

