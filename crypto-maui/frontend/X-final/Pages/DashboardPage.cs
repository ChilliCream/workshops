using CommunityToolkit.Maui.Markup;
using static CommunityToolkit.Maui.Markup.GridRowsColumns;

namespace MauiCrypto;

class DashboardPage : BasePage<DashboardViewModel>
{
	readonly CryptoTickerView _stockTickerView;

	public DashboardPage(DashboardViewModel dashboardViewModel) : base(dashboardViewModel)
	{
		Content = new ScrollView
		{
			Content = new Grid
			{
				RowDefinitions = Rows.Define(
					(Row.Ticker, CryptoTickerView.OptimalHeight),
					(Row.TickerSeparator, SeparatorView.RecommendedSeparatorViewSize),
					(Row.ChartCarousel, 240),
					(Row.ChartCarouselSeparator, SeparatorView.RecommendedSeparatorViewSize),
					(Row.TopGainers, 332),
					(Row.TopGainersSeparator, SeparatorView.RecommendedSeparatorViewSize),
					(Row.TopLosers, 332)),

				Children =
				{
					new CryptoTickerView()
						.Row(Row.Ticker)
						.Assign(out _stockTickerView)
						.Bind(CollectionView.ItemsSourceProperty, nameof(DashboardViewModel.AssetCollection)),

					new SeparatorView()
						.FillHorizontal()
						.Row(Row.TickerSeparator),

					new SeparatorView()
						.FillHorizontal()
						.Row(Row.ChartCarouselSeparator),

					new TopGainersView()
						.Row(Row.TopGainers),

					new SeparatorView()
						.FillHorizontal()
						.Row(Row.TopGainersSeparator),
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