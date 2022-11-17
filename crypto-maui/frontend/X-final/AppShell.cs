using MauiCrypto;

namespace MauiCrypto;

class AppShell : Shell
{
	public AppShell()
	{
		Items.Add(new MauiCryptoFlyoutItem<DashboardPage>("Dashboard", "dashboard_icon.png"));
		Items.Add(new MauiCryptoFlyoutItem<ScreenerPage>("Screener", "screener_icon.png"));
		Items.Add(new MauiCryptoFlyoutItem<WatchlistPage>("Watchlist", "watchlist_icon.png"));
		Items.Add(new MauiCryptoFlyoutItem<SettingsPage>("Settings", "settings_icon.png"));
	}

	public static string GetRoute<TPage, TViewModel>() where TPage : BasePage<TViewModel>
														where TViewModel : BaseViewModel
	{
		return typeof(TPage).Name switch
		{
			nameof(DashboardPage) => $"//{nameof(DashboardPage)}",
			nameof(ScreenerPage) => $"//{nameof(ScreenerPage)}",
			nameof(SettingsPage) => $"//{nameof(SettingsPage)}",
			nameof(WatchlistPage) => $"//{nameof(WatchlistPage)}",
			nameof(AssetChartPage) => $"//{nameof(AssetChartPage)}",
			_ => throw new NotSupportedException($"No Route Added for {typeof(TPage).Name}")
		};
	}

	class MauiCryptoFlyoutItem<TPage> : FlyoutItem where TPage : BasePage
	{
		public MauiCryptoFlyoutItem(in string title, in string icon)
		{
			Icon = icon;
			Title = title;

			Items.Add(new ShellContent { ContentTemplate = new DataTemplate(typeof(TPage)) });
		}
	}
}