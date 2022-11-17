using CommunityToolkit.Maui.Markup;
using static CommunityToolkit.Maui.Markup.GridRowsColumns;

namespace MauiCrypto;

sealed class AssetChartPage : BasePage<AssetChartViewModel>, IDisposable
{
	CancellationTokenSource? _updatePriceHistoryCommandTCS;

	public AssetChartPage(AssetChartViewModel assetChartViewModel) : base(assetChartViewModel, "Asset", false)
	{
#if WINDOWS
		const int priceHeight = 80;
#else
		const int priceHeight = 68;
#endif
		const int dataRowHeight = 28;
		const int separatorRowHeight = 12;
		const int statsCategoryTitleRowHeight = 52;

		Shell.SetPresentationMode(this, PresentationMode.ModalAnimated);

		Padding = new Thickness(12, 12, 12, 0);

		Content = new Grid
		{
			RowDefinitions = Rows.Define(
				(Row.Title, AssetChartTitleRowView.OptimalHeight),
				(Row.Price, priceHeight),
				(Row.TimeSpan, 48),
				(Row.Chart, 252),
				(Row.ScrollingContent, Star)),

			Children =
			{
				new AssetChartTitleRowView()
					.Row(Row.Title),

				new AssetChartPriceRowView()
					.Row(Row.Price),

				new AssetChartTimeSpanRowView()
					.Row(Row.TimeSpan),

				new PriceHistoryChartView(true)
					.Row(Row.Chart)
					.Top(),

				new ScrollView
				{
					Content = new Grid
					{
						RowDefinitions = Rows.Define(
							(ScrollingRow.MarketStatsTitle, statsCategoryTitleRowHeight),
							(ScrollingRow.MarketStatsRow1Title, 26),
							(ScrollingRow.MarketStatsRow1Data, dataRowHeight),
							(ScrollingRow.MarketStatsRow1Separator, separatorRowHeight),
							(ScrollingRow.MarketStatsRow2Title, 26),
							(ScrollingRow.MarketStatsRow2Data, dataRowHeight),
							(ScrollingRow.MarketStatsRow2Separator, separatorRowHeight),
							(ScrollingRow.OverviewTitle, statsCategoryTitleRowHeight),
							(ScrollingRow.OverviewText, Auto),
							(ScrollingRow.ResourcesTitle, statsCategoryTitleRowHeight),
							(ScrollingRow.Whitepaper, 28),
							(ScrollingRow.Website, 28)),

						ColumnDefinitions = Columns.Define(
							(ScrollingColumn.Stats1, Star),
							(ScrollingColumn.Stats2, Star),
							(ScrollingColumn.Stats3, Star)),

						Children =
						{
							new StatsCategoryTitleLabel()
								.Row(ScrollingRow.MarketStatsTitle).ColumnSpan(All<ScrollingColumn>())
								.Text("Market Stats"),

							new MarketStatsTitleLabel()
								.Row(ScrollingRow.MarketStatsRow1Title).Column(ScrollingColumn.Stats1)
								.Text("Market Cap").Margins(left: 8),

							new MarketStatsTitleLabel()
								.Row(ScrollingRow.MarketStatsRow1Title).Column(ScrollingColumn.Stats2)
								.Text("Volume 24h"),

							new MarketStatsTitleLabel()
								.Row(ScrollingRow.MarketStatsRow1Title).Column(ScrollingColumn.Stats3)
								.Text("Supply"),

							new MarketStatsSeparator()
								.Row(ScrollingRow.MarketStatsRow1Separator).Column(ScrollingColumn.Stats1),

							new MarketStatsSeparator()
								.Row(ScrollingRow.MarketStatsRow1Separator).Column(ScrollingColumn.Stats2),

							new MarketStatsSeparator()
								.Row(ScrollingRow.MarketStatsRow1Separator).Column(ScrollingColumn.Stats3),

							new MarketStatsDataLabel()
								.Row(ScrollingRow.MarketStatsRow1Data).Column(ScrollingColumn.Stats1)
								.Bind(Label.TextProperty, nameof(AssetChartViewModel.MarketCap), convert: static (double marketCap) => $"${marketCap.ToAbbreviatedText()}"),

							new MarketStatsDataLabel()
								.Row(ScrollingRow.MarketStatsRow1Data).Column(ScrollingColumn.Stats2)
								.Bind(Label.TextProperty, nameof(AssetChartViewModel.Volume24Hour), convert: static (double volume) => $"${volume.ToAbbreviatedText()}"),

							new MarketStatsDataLabel()
								.Row(ScrollingRow.MarketStatsRow1Data).Column(ScrollingColumn.Stats3)
								.Bind(Label.TextProperty, nameof(AssetChartViewModel.CirculatingSupply), convert: static (double supply) => supply.ToAbbreviatedText()),

							new MarketStatsSeparator()
								.Row(ScrollingRow.MarketStatsRow2Separator).Column(ScrollingColumn.Stats1),

							new MarketStatsSeparator()
								.Row(ScrollingRow.MarketStatsRow2Separator).Column(ScrollingColumn.Stats2),

							new MarketStatsSeparator()
								.Row(ScrollingRow.MarketStatsRow2Separator).Column(ScrollingColumn.Stats3),

							new MarketStatsTitleLabel()
								.Row(ScrollingRow.MarketStatsRow2Title).Column(ScrollingColumn.Stats1)
								.Text("Max Supply").Margins(left: 8),

							new MarketStatsTitleLabel()
								.Row(ScrollingRow.MarketStatsRow2Title).Column(ScrollingColumn.Stats2)
								.Text("Trading Activity"),

							new MarketStatsTitleLabel()
								.Row(ScrollingRow.MarketStatsRow2Title).Column(ScrollingColumn.Stats3)
								.Text("Popularity"),

							new MarketStatsDataLabel()
								.Row(ScrollingRow.MarketStatsRow2Data).Column(ScrollingColumn.Stats1)
								.Bind(Label.TextProperty, nameof(AssetChartViewModel.MaxSupply), convert: static (double supply) => supply.ToAbbreviatedText()),

							new MarketStatsDataLabel()
								.Row(ScrollingRow.MarketStatsRow2Data).Column(ScrollingColumn.Stats2)
								.Bind(Label.TextProperty, nameof(AssetChartViewModel.TradingActivity), convert: static (double? activityPercentage) => double.IsNegative(activityPercentage ?? 0) ? $"-{activityPercentage:P0}" : $"+{activityPercentage:P0}")
								.Bind(Label.TextColorProperty, nameof(AssetChartViewModel.TradingActivity), convert: static (double? activityPercentage) => double.IsNegative(activityPercentage ?? 0)
																																							? (Color?)Application.Current?.Resources[nameof(BaseTheme.NegativeStockColor)]
																																							: (Color?)Application.Current?.Resources[nameof(BaseTheme.PositiveStockColor)]),

							new MarketStatsDataLabel()
								.Row(ScrollingRow.MarketStatsRow2Data).Column(ScrollingColumn.Stats3)
								.Bind(Label.TextProperty, nameof(AssetChartViewModel.TradableMarketCapRank), convert: static (double? rank) => $"#{rank}"),

							new StatsCategoryTitleLabel()
								.Row(ScrollingRow.OverviewTitle).ColumnSpan(All<ScrollingColumn>())
								.Text("Overview"),

							new MarketStatsTitleLabel()
								.Row(ScrollingRow.OverviewText).ColumnSpan(All<ScrollingColumn>())
								.Bind(Label.TextProperty, nameof(AssetChartViewModel.AssetDescription)),

							new StatsCategoryTitleLabel()
								.Row(ScrollingRow.ResourcesTitle).ColumnSpan(All<ScrollingColumn>())
								.Text("Resources"),

							new HorizontalStackLayout
							{
								Spacing = 12,

								Children =
								{
									new Image()
										.Source("whitepaper_icon.png")
										.CenterVertical()
										.Size(24),

									new TappableLabel()
										.Text("Whitepaper").TextCenter().Font(size: 16)
										.CenterVertical()
										.Bind(TappableLabel.CommandProperty, nameof(AssetChartViewModel.OpenWhitePaperCommand))
										.Bind(TappableLabel.CommandParameterProperty, nameof(AssetChartViewModel.WhitePaper))
										.DynamicResource(Label.TextColorProperty, nameof(BaseTheme.SecondaryTextColor))
								}
							}.Row(ScrollingRow.Whitepaper).ColumnSpan(All<ScrollingColumn>())
							 .CenterVertical(),

							new HorizontalStackLayout
							{
								Spacing = 12,

								Children =
								{
									new Image()
										.Source("website_icon.png")
										.CenterVertical()
										.Size(24),

									new TappableLabel()
										.Text("Website").TextCenter().Font(size: 16)
										.CenterVertical()
										.Bind(TappableLabel.CommandProperty, nameof(AssetChartViewModel.OpenWebsiteCommand))
										.Bind(TappableLabel.CommandParameterProperty, nameof(AssetChartViewModel.Website))
										.DynamicResource(Label.TextColorProperty, nameof(BaseTheme.SecondaryTextColor))
								}
							}.Row(ScrollingRow.Website).ColumnSpan(All<ScrollingColumn>())
							 .CenterVertical(),
						}
					}
				}.Row(Row.ScrollingContent)
			}
		};
	}

	enum Row { Title, Price, TimeSpan, Chart, ScrollingContent }

	enum ScrollingRow { MarketStatsTitle, MarketStatsRow1Title, MarketStatsRow1Data, MarketStatsRow1Separator, MarketStatsRow2Title, MarketStatsRow2Data, MarketStatsRow2Separator, OverviewTitle, OverviewText, ResourcesTitle, Whitepaper, Website }
	enum ScrollingColumn { Stats1, Stats2, Stats3 }

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

	class MarketStatsSeparator : SeparatorView
	{
		public MarketStatsSeparator()
		{
			this.Height(1).Top().Margins(top: 4, left: 8, right: 8);
		}
	}

	class MarketStatsTitleLabel : Label
	{
		public MarketStatsTitleLabel()
		{
			this.Font(size: 16).Start().Top();
		}
	}

	class MarketStatsDataLabel : Label
	{
		public MarketStatsDataLabel()
		{
			this.Font(size: 18, bold: true).End().Bottom().Margins(right: 12);

			LineBreakMode = LineBreakMode.TailTruncation;
		}
	}

	class StatsCategoryTitleLabel : Label
	{
		public StatsCategoryTitleLabel()
		{
			this.Font(size: 20).TextCenterVertical();
		}
	}
}