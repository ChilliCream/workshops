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
				(Row.Title, 48),
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

	class TitleRow : Grid
	{
		public TitleRow()
		{
			ColumnDefinitions = Columns.Define(
				(Column.Icon, 44),
				(Column.Title, Auto),
				(Column.Symbol, Star),
				(Column.Notifications, 44),
				(Column.Favorite, 44));

			Children.Add(new Image()
							.Column(Column.Icon)
							.Center()
							.Bind(Image.SourceProperty, nameof(AssetChartViewModel.AssetImageUrl)));

			Children.Add(new Label()
							.Column(Column.Title)
							.TextCenter()
							.Bind(Label.TextProperty, nameof(AssetChartViewModel.AssetName))
							.DynamicResource(Label.TextColorProperty, nameof(BaseTheme.PrimaryTextColor)));

			Children.Add(new Label { BackgroundColor = Color.FromRgba(0, 0, 0, 0.87) }
							.Column(Column.Symbol)
							.Bind(Label.TextProperty, nameof(AssetChartViewModel.AssetSymbol))
							.DynamicResource(Label.TextColorProperty, nameof(BaseTheme.PrimaryTextColor)));

			Children.Add(new Image()
							.Column(Column.Notifications)
							.Source("notification_icon"));

			Children.Add(new Image()
							.Column(Column.Favorite)
							.Source("not_favorite"));
		}

		enum Column { Icon, Title, Symbol, Notifications, Favorite }
	}
}

