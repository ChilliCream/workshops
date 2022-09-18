using CommunityToolkit.Maui.Markup;
using static CommunityToolkit.Maui.Markup.GridRowsColumns;

namespace MauiCrypto;

class AssetChartPage : BasePage<AssetChartViewModel>
{
	public AssetChartPage(AssetChartViewModel assetChartViewModel, IDispatcher dispatcher) : base(assetChartViewModel, dispatcher, "Asset")
	{
		Shell.SetPresentationMode(this, PresentationMode.ModalAnimated);

		Content = new Grid
		{
			RowDefinitions = Rows.Define(
				(Row.Title, TitleRow.OptimalHeight),
				(Row.Price, 48),
				(Row.TimeSpan, 48),
				(Row.Chart, 236),
				(Row.MarketStatsTitle, 44),
				(Row.MarketCap, 52),
				(Row.MaxSupply, 52),
				(Row.OverviewTitle, 44),
				(Row.OverviewText, Auto),
				(Row.ResourcesTitle, 44),
				(Row.Whitepaper, 24),
				(Row.Website, 24)),

			ColumnDefinitions = Columns.Define(
				(Column.Stats1, Star),
				(Column.Stats2, Star),
				(Column.Stats3, Star)),

			Children =
			{
				new TitleRow()
					.Row(Row.Title).ColumnSpan(All<Column>()),

				new PriceHistoryChartView()
					.Row(Row.Chart).ColumnSpan(All<Column>())
			}
		};
	}

	enum Row { Title, Price, TimeSpan, Chart, MarketStatsTitle, MarketCap, MaxSupply, OverviewTitle, OverviewText, ResourcesTitle, Whitepaper, Website }
	enum Column { Stats1, Stats2, Stats3 }

	protected override async void OnAppearing()
	{
		base.OnAppearing();

		var cancellationTokenSource = new CancellationTokenSource(TimeSpan.FromSeconds(30));
		await BindingContext.UpdatePriceHistoryCommand.ExecuteAsync(cancellationTokenSource.Token);
	}
}

