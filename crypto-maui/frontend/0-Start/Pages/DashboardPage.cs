using CommunityToolkit.Maui.Markup;
using static CommunityToolkit.Maui.Markup.GridRowsColumns;

namespace MauiCrypto;

class DashboardPage : BasePage<DashboardViewModel>
{
	const int _chartCarouselHeight = 240;
	readonly CryptoTickerView _stockTickerView;

	public DashboardPage(IDeviceDisplay deviceDisplay, DashboardViewModel dashboardViewModel)
		: base(dashboardViewModel, "Dashboard", false)
	{
		Padding = 0;

		var screenWidth = deviceDisplay.MainDisplayInfo.Width / deviceDisplay.MainDisplayInfo.Density;

		Content = new ScrollView
		{
			Content = new Grid
			{
				RowDefinitions = Rows.Define(
					(Row.TopPadding, 4),
					(Row.Ticker, CryptoTickerView.OptimalHeight),
					(Row.TickerSeparator, SeparatorView.RecommendedSeparatorViewSize),
					(Row.ChartCarousel, _chartCarouselHeight),
					(Row.ChartCarouselSeparator, SeparatorView.RecommendedSeparatorViewSize),
					(Row.TopGainers, TopPerformersView.OptimalHeight),
					(Row.TopGainersSeparator, SeparatorView.RecommendedSeparatorViewSize),
					(Row.TopLosers, TopPerformersView.OptimalHeight)),

				Children =
				{
					new CryptoTickerView()
						.Row(Row.Ticker)
						.Assign(out _stockTickerView)
						.Bind(CollectionView.ItemsSourceProperty, nameof(DashboardViewModel.AssetList)),

					new SeparatorView()
						.Row(Row.TickerSeparator)
						.Margin(12, 0)
						.FillHorizontal(),

					new AssetCarouselView()
						.Row(Row.ChartCarousel)
						.Size(screenWidth, _chartCarouselHeight - 24)
						.Center().Margin(0, 12)
						.ItemTemplate(new AssetChartCarouselViewDataTemplate())
						.Bind(CarouselView.ItemsSourceProperty, nameof(DashboardViewModel.NamedCryptoPriceHistoryList))
						.Bind(CarouselView.CurrentItemChangedCommandParameterProperty, nameof(CarouselView.CurrentItem), source: RelativeBindingSource.Self)
						.Bind(CarouselView.CurrentItemChangedCommandProperty, nameof(DashboardViewModel.UpdateCarouselViewChartCommand)),

					new SeparatorView()
						.Margin(12, 0)
						.FillHorizontal()
						.Row(Row.ChartCarouselSeparator),

					new TopPerformersView("top_gainers_icon.png", "Top Gainers", nameof(DashboardViewModel.TopGainersList))
						.Margin(12, 0)
						.Row(Row.TopGainers),

					new TopPerformersView("top_losers_icon.png", "Top Losers", nameof(DashboardViewModel.TopLosersList))
						.Margin(12, 0)
						.Row(Row.TopLosers),
				}
			}
		};
	}

	enum Row { TopPadding, Ticker, TickerSeparator, ChartCarousel, ChartCarouselSeparator, TopGainers, TopGainersSeparator, TopLosers }

	protected override async void OnAppearing()
	{
		base.OnAppearing();

		if (_stockTickerView.ItemsSource.IsNullOrEmpty())
		{
			var cancellationTokenSource = new CancellationTokenSource(TimeSpan.FromSeconds(5));
			await BindingContext.RefreshCollectionViewCommand.ExecuteAsync(cancellationTokenSource.Token);
		}
	}

	class AssetCarouselView : CarouselView
	{
		public AssetCarouselView()
		{
			PeekAreaInsets = 24;

			ItemsLayout = new LinearItemsLayout(ItemsLayoutOrientation.Horizontal)
			{
				ItemSpacing = 16,
				SnapPointsType = SnapPointsType.MandatorySingle,
				SnapPointsAlignment = SnapPointsAlignment.Center,
			};
		}
	}
}