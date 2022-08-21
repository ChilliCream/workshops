using CommunityToolkit.Maui;
using CommunityToolkit.Maui.Markup;
using Microsoft.Extensions.DependencyInjection;

namespace MauiCrypto;

public static class MauiProgram
{
	public static MauiApp CreateMauiApp()
	{
		var builder = MauiApp.CreateBuilder()
						.UseMauiApp<App>()
						.UseMauiCommunityToolkit()
						.UseMauiCommunityToolkitMarkup()
						.ConfigureFonts(fonts =>
						{
							fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
							fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
						});
		// Add Shell
		builder.Services.AddSingleton<AppShell>();

		// Add Pages + ViewModels
		builder.Services.AddTransientWithShellRoute<DashboardPage, DashboardViewModel>();
		builder.Services.AddTransientWithShellRoute<ScreenerPage, ScreenerViewModel>();
		builder.Services.AddTransientWithShellRoute<WatchlistPage, WatchlistViewModel>();
		builder.Services.AddTransientWithShellRoute<SettingsPage, SettingsViewModel>();

		// Add Services

		return builder.Build();
	}

	static IServiceCollection AddTransientWithShellRoute<TPage, TViewModel>(this IServiceCollection services) where TPage : BasePage<TViewModel>
																													where TViewModel : BaseViewModel
	{
		return services.AddTransientWithShellRoute<TPage, TViewModel>(AppShell.GetRoute<TPage, TViewModel>());
	}
}
