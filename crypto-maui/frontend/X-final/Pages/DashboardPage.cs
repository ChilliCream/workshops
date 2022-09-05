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
					(Row.TickerSeparator, 1),
					(Row.Charts, 240),
					(Row.ChartsSeparator, 1),
					(Row.TopGainers, 332),
					(Row.TopGainersSeparator, 1),
					(Row.TopLosers, 332)),

				Children =
				{
					new CryptoTickerView()
						.Row(Row.Ticker)
						.Assign(out _stockTickerView)
						.Bind(CollectionView.ItemsSourceProperty, nameof(DashboardViewModel.AssetCollection))
				}
			}
		};
	}

	enum Row { Ticker, TickerSeparator, Charts, ChartsSeparator, TopGainers, TopGainersSeparator, TopLosers }
	enum Column { Icon, Name, PercentChange, FavoriteButton, ToggleButton }

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