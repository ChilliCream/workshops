using CommunityToolkit.Maui.Markup;
using static CommunityToolkit.Maui.Markup.GridRowsColumns;

namespace MauiCrypto;

class DashboardPage : BasePage<DashboardViewModel>
{
	readonly CryptoTickerView _stockTickerView;

	public DashboardPage(DashboardViewModel dashboardViewModel) : base(dashboardViewModel, "Dashboard")
	{
		Padding = 0;

		Content = new ScrollView
		{
			Content = new Grid
			{
				RowDefinitions = Rows.Define(
					(Row.Ticker, CryptoTickerView.OptimalHeight),
					(Row.TickerSeparator, SeparatorView.RecommendedSeparatorViewSize),
					(Row.ChartCarousel, 240),
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
						.FillHorizontal()
						.Row(Row.TickerSeparator),

					new SeparatorView()
						.FillHorizontal()
						.Row(Row.ChartCarouselSeparator),

					new TopPerformersView("top_gainers_icon", "Top Gainers", nameof(DashboardViewModel.TopGainersList))
						.Row(Row.TopGainers),

					new TopPerformersView("top_losers_icon", "Top Losers", nameof(DashboardViewModel.TopLosersList))
						.Row(Row.TopLosers),
				}
			}
		};
	}

	enum Row { Ticker, TickerSeparator, ChartCarousel, ChartCarouselSeparator, TopGainers, TopGainersSeparator, TopLosers }

	protected override async void OnAppearing()
	{
		base.OnAppearing();

		if (_stockTickerView.ItemsSource.IsNullOrEmpty())
		{
			var cancellationTokenSource = new CancellationTokenSource(TimeSpan.FromSeconds(5));
			await BindingContext.RefreshCollectionViewCommand.ExecuteAsync(cancellationTokenSource.Token);
		}
	}
}