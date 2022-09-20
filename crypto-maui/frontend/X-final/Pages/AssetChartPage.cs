using System.Windows.Input;
using CommunityToolkit.Maui.Markup;
using CommunityToolkit.Mvvm.Input;
using static CommunityToolkit.Maui.Markup.GridRowsColumns;

namespace MauiCrypto;

sealed class AssetChartPage : BasePage<AssetChartViewModel>, IDisposable
{
	CancellationTokenSource? _updatePriceHistoryCommandTCS;

	public AssetChartPage(AssetChartViewModel assetChartViewModel, IDispatcher dispatcher, IBrowser browser) : base(assetChartViewModel, dispatcher, "Asset")
	{
		const int dataRowHeight = 28;
		const int separatorRowHeight = 12;
		const int statsCategoryTitleRowHeight = 52;

		Shell.SetPresentationMode(this, PresentationMode.ModalAnimated);

		Content = new Grid
		{
			RowDefinitions = Rows.Define(
				(Row.Title, AssetChartTitleRowView.OptimalHeight),
				(Row.Price, 48),
				(Row.TimeSpan, 48),
				(Row.Chart, 252),
				(Row.MarketStatsTitle, statsCategoryTitleRowHeight),
				(Row.MarketStatsRow1Title, 26),
				(Row.MarketStatsRow1Data, dataRowHeight),
				(Row.MarketStatsRow1Separator, separatorRowHeight),
				(Row.MarketStatsRow2Title, 26),
				(Row.MarketStatsRow2Data, dataRowHeight),
				(Row.MarketStatsRow2Separator, separatorRowHeight),
				(Row.OverviewTitle, statsCategoryTitleRowHeight),
				(Row.OverviewText, Auto),
				(Row.ResourcesTitle, statsCategoryTitleRowHeight),
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
					.Top(),

				new StatsCategoryTitleLabel()
					.Row(Row.MarketStatsTitle).ColumnSpan(All<Column>())
					.Text("Market Stats"),

				new MarketStatsTitleLabel()
					.Row(Row.MarketStatsRow1Title).Column(Column.Stats1)
					.Text("Market Cap").Margins(left: 8),

				new MarketStatsTitleLabel()
					.Row(Row.MarketStatsRow1Title).Column(Column.Stats2)
					.Text("Volume 24h"),

				new MarketStatsTitleLabel()
					.Row(Row.MarketStatsRow1Title).Column(Column.Stats3)
					.Text("Supply"),

				new MarketStatsSeparator()
					.Row(Row.MarketStatsRow1Separator).Column(Column.Stats1),

				new MarketStatsSeparator()
					.Row(Row.MarketStatsRow1Separator).Column(Column.Stats2),

				new MarketStatsSeparator()
					.Row(Row.MarketStatsRow1Separator).Column(Column.Stats3),

				new MarketStatsDataLabel()
					.Row(Row.MarketStatsRow1Data).Column(Column.Stats1)
					.Bind(Label.TextProperty, nameof(AssetChartViewModel.MarketCap), convert: static (double marketCap) => $"${marketCap.ToAbbreviatedText()}"),

				new MarketStatsDataLabel()
					.Row(Row.MarketStatsRow1Data).Column(Column.Stats2)
					.Bind(Label.TextProperty, nameof(AssetChartViewModel.Volume24Hour), convert: static (double volume) => $"${volume.ToAbbreviatedText()}"),

				new MarketStatsDataLabel()
					.Row(Row.MarketStatsRow1Data).Column(Column.Stats3)
					.Bind(Label.TextProperty, nameof(AssetChartViewModel.CirculatingSupply), convert: static (double supply) => supply.ToAbbreviatedText()),

				new MarketStatsSeparator()
					.Row(Row.MarketStatsRow2Separator).Column(Column.Stats1),

				new MarketStatsSeparator()
					.Row(Row.MarketStatsRow2Separator).Column(Column.Stats2),

				new MarketStatsSeparator()
					.Row(Row.MarketStatsRow2Separator).Column(Column.Stats3),

				new MarketStatsTitleLabel()
					.Row(Row.MarketStatsRow2Title).Column(Column.Stats1)
					.Text("Max Supply").Margins(left: 8),

				new MarketStatsTitleLabel()
					.Row(Row.MarketStatsRow2Title).Column(Column.Stats2)
					.Text("Trading Activity"),

				new MarketStatsTitleLabel()
					.Row(Row.MarketStatsRow2Title).Column(Column.Stats3)
					.Text("Popularity"),

				new MarketStatsDataLabel()
					.Row(Row.MarketStatsRow2Data).Column(Column.Stats1)
					.Bind(Label.TextProperty, nameof(AssetChartViewModel.MaxSupply), convert: static (double supply) => supply.ToAbbreviatedText()),

				new MarketStatsDataLabel()
					.Row(Row.MarketStatsRow2Data).Column(Column.Stats2)
					.Bind(Label.TextProperty, nameof(AssetChartViewModel.TradingActivity), convert: static (double? activityPercentage) => double.IsNegative(activityPercentage ?? 0) ? $"-{activityPercentage:P0}" : $"+{activityPercentage:P0}")
					.Bind(Label.TextColorProperty, nameof(AssetChartViewModel.TradingActivity), convert: static (double? activityPercentage) => double.IsNegative(activityPercentage ?? 0)
																																				? (Color?)Application.Current?.Resources[nameof(BaseTheme.NegativeStockColor)]
																																				: (Color?)Application.Current?.Resources[nameof(BaseTheme.PositiveStockColor)]),

				new MarketStatsDataLabel()
					.Row(Row.MarketStatsRow2Data).Column(Column.Stats3)
					.Bind(Label.TextProperty, nameof(AssetChartViewModel.TradableMarketCapRank), convert: static (double? rank) => $"#{rank}"),

				new StatsCategoryTitleLabel()
					.Row(Row.OverviewTitle).ColumnSpan(All<Column>())
					.Text("Overview"),

				new MarketStatsTitleLabel()
					.Row(Row.OverviewText).ColumnSpan(All<Column>())
					.Bind(Label.TextProperty, nameof(AssetChartViewModel.AssetDescription)),

				new StatsCategoryTitleLabel()
					.Row(Row.ResourcesTitle).ColumnSpan(All<Column>())
					.Text("Resources"),

				new HorizontalStackLayout
				{
					Spacing = 12,

					Children =
					{
						new Image()
							.Source("whitepaper_icon")
							.CenterVertical()
							.Size(24),

						new TappableLabel { Command = new AsyncRelayCommand<string>(url => browser.OpenAsync(url ?? throw new InvalidOperationException("URL cannot be null"))) }
							.Text("Whitepaper").TextCenter().Font(size: 16)
							.CenterVertical()
							.Bind(TappableLabel.CommandParameterProperty, nameof(AssetChartViewModel.WhitePaper))
							.DynamicResource(Label.TextColorProperty, nameof(BaseTheme.SecondaryTextColor))
					}
				}.Row(Row.Whitepaper).ColumnSpan(All<Column>())
				 .CenterVertical(),

				new HorizontalStackLayout
				{
					Spacing = 12,

					Children =
					{
						new Image()
							.Source("website_icon")
							.CenterVertical()
							.Size(24),

						new TappableLabel { Command = new AsyncRelayCommand<string>(url => browser.OpenAsync(url ?? throw new InvalidOperationException("URL cannot be null"))) }
							.Text("Website").TextCenter().Font(size: 16)
							.CenterVertical()
							.Bind(TappableLabel.CommandParameterProperty, nameof(AssetChartViewModel.Website))
							.DynamicResource(Label.TextColorProperty, nameof(BaseTheme.SecondaryTextColor))
					}
				}.Row(Row.Website).ColumnSpan(All<Column>())
				 .CenterVertical(),
			}
		};
	}

	enum Row { Title, Price, TimeSpan, Chart, MarketStatsTitle, MarketStatsRow1Title, MarketStatsRow1Data, MarketStatsRow1Separator, MarketStatsRow2Title, MarketStatsRow2Data, MarketStatsRow2Separator, OverviewTitle, OverviewText, ResourcesTitle, Whitepaper, Website }
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

	class ResourceRowLayout : HorizontalStackLayout
	{
		public static readonly BindableProperty CommandProperty = BindableProperty.Create(nameof(Command), typeof(ICommand), typeof(ResourceRowLayout));
		public static readonly BindableProperty CommandParameterProperty = BindableProperty.Create(nameof(CommandProperty), typeof(object), typeof(ResourceRowLayout));

		public ResourceRowLayout(IBrowser browser, in string imageSource, in string text, string url)
		{

		}

		public ICommand? Command
		{
			get => (ICommand)GetValue(CommandProperty);
			set => SetValue(CommandProperty, value);
		}

		public object? CommandParameter
		{
			get => (object?)GetValue(CommandParameterProperty);
			set => SetValue(CommandParameterProperty, value);
		}
	}
}

