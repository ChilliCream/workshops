using CommunityToolkit.Maui.Markup;
using static CommunityToolkit.Maui.Markup.GridRowsColumns;

namespace MauiCrypto;

sealed class AssetChartPage : BasePage<AssetChartViewModel>, IDisposable
{
	CancellationTokenSource? _updatePriceHistoryCommandTCS;

	public AssetChartPage(AssetChartViewModel assetChartViewModel, IDispatcher dispatcher) : base(assetChartViewModel, dispatcher, "Asset")
	{
		Shell.SetPresentationMode(this, PresentationMode.ModalAnimated);

		Content = new Grid
		{
			RowDefinitions = Rows.Define(
				(Row.Title, AssetChartTitleRowView.OptimalHeight),
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
				new AssetChartTitleRowView()
					.Row(Row.Title).ColumnSpan(All<Column>()),

				new AssetChartPriceRowView()
					.Row(Row.Price).ColumnSpan(All<Column>()),

				new AssetChartTimeSpanRowView()
					.Row(Row.TimeSpan).ColumnSpan(All<Column>()),

				new PriceHistoryChartView()
					.Row(Row.Chart).ColumnSpan(All<Column>())
			}
		};
	}

	enum Row { Title, Price, TimeSpan, Chart, MarketStatsTitle, MarketCap, MaxSupply, OverviewTitle, OverviewText, ResourcesTitle, Whitepaper, Website }
	enum Column { Stats1, Stats2, Stats3 }

	public void Dispose()
	{
		_updatePriceHistoryCommandTCS?.Dispose();
	}

	protected override async void OnAppearing()
	{
		base.OnAppearing();

		_updatePriceHistoryCommandTCS = new CancellationTokenSource(TimeSpan.FromSeconds(30));
		await BindingContext.UpdatePriceHistoryCommand.ExecuteAsync(_updatePriceHistoryCommandTCS.Token);
	}

	protected override void OnDisappearing()
	{
		base.OnDisappearing();

		_updatePriceHistoryCommandTCS?.Cancel();
	}
}

