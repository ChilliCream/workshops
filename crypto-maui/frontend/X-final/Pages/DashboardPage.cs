﻿using CommunityToolkit.Maui.Markup;
using static CommunityToolkit.Maui.Markup.GridRowsColumns;

namespace MauiCrypto;

class DashboardPage : BasePage<DashboardViewModel>
{
	readonly CryptoTickerView _stockTickerView;

	public DashboardPage(DashboardViewModel dashboardViewModel, IDispatcher dispatcher)
		: base(dashboardViewModel, dispatcher, "Dashboard", false)
	{
		Padding = 0;

		Content = new ScrollView
		{
			Content = new Grid
			{
				RowDefinitions = Rows.Define(
					(Row.TopPadding, 4),
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
						.Row(Row.TickerSeparator)
						.Margin(12, 0)
						.FillHorizontal(),

					new AssetCarouselView()
						.Row(Row.ChartCarousel)
						.Center().Margin(0, 12)
						.ItemTemplate(new AssetChartCarouselViewDataTemplate())
						.Bind(CarouselView.ItemsSourceProperty, nameof(DashboardViewModel.NamedCryptoPriceHistoryList))
						.Bind(CarouselView.CurrentItemChangedCommandParameterProperty, nameof(CarouselView.CurrentItem), source: RelativeBindingSource.Self)
						.Bind(CarouselView.CurrentItemChangedCommandProperty, nameof(DashboardViewModel.UpdateCarouselViewChartCommand)),

					new SeparatorView()
						.Margin(12, 0)
						.FillHorizontal()
						.Row(Row.ChartCarouselSeparator),

					new TopPerformersView("top_gainers_icon", "Top Gainers", nameof(DashboardViewModel.TopGainersList))
						.Margin(12, 0)
						.Row(Row.TopGainers),

					new TopPerformersView("top_losers_icon", "Top Losers", nameof(DashboardViewModel.TopLosersList))
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
			Margin = 0;

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