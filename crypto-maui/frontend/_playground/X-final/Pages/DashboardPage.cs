using CommunityToolkit.Maui.Markup;
using static CommunityToolkit.Maui.Markup.GridRowsColumns;

namespace MauiCrypto;

class DashboardPage : BasePage<DashboardViewModel>
{
	public DashboardPage(DashboardViewModel dashboardViewModel) : base(dashboardViewModel)
	{
		Content = new ScrollView
		{
			Content = new Grid
			{
				RowDefinitions = Rows.Define(
					(Row.Ticker, 48),
					(Row.TickerSeparator, 1),
					(Row.Charts, 240),
					(Row.ChartsSeparator, 1),
					(Row.TopGainers, 332),
					(Row.TopGainersSeparator, 1),
					(Row.TopLosers, 332)),

				Children =
				{
					new StockTickerView()
						.Row(Row.Ticker)
						.Bind(CollectionView.ItemsSourceProperty, nameof(DashboardViewModel.StockTickerModelList))
				}
			}
		};
	}

	enum Row {  Ticker, TickerSeparator, Charts, ChartsSeparator, TopGainers, TopGainersSeparator, TopLosers }
	enum Column {  Icon, Name, PercentChange, FavoriteButton, ToggleButton }
}
