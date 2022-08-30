using System;
using System.Net;
using System.Runtime.CompilerServices;
using CommunityToolkit.Maui;
using CommunityToolkit.Maui.Markup;
using Polly;

namespace MauiCrypto;

public static partial class MauiProgram
{
	readonly static string _apiUrl;

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
		builder.Services.AddSingleton<CryptoGraphQLService>();

		builder.Services.AddMauiCryptoClient()
						.ConfigureHttpClient(
							client => client.BaseAddress = GetGraphQLUri(),
							clientBuilder => clientBuilder
												.ConfigurePrimaryHttpMessageHandler(GetHttpMessageHandler)
												.AddTransientHttpErrorPolicy(builder => builder.WaitAndRetryAsync(3, sleepDurationProvider)))
						.ConfigureWebSocketClient(client => client.Uri = new UriBuilder(_apiUrl) { Scheme = Uri.UriSchemeWs }.Uri);

		return builder.Build();

		static TimeSpan sleepDurationProvider(int attemptNumber) => TimeSpan.FromSeconds(Math.Pow(2, attemptNumber));
	}

	static IServiceCollection AddTransientWithShellRoute<TPage, TViewModel>(this IServiceCollection services) where TPage : BasePage<TViewModel>
																												where TViewModel : BaseViewModel
	{
		return services.AddTransientWithShellRoute<TPage, TViewModel>(AppShell.GetRoute<TPage, TViewModel>());
	}

	static DecompressionMethods GetDecompressionMethods() => DecompressionMethods.Deflate | DecompressionMethods.GZip;

	static Uri GetGraphQLUri()
	{
		return new UriBuilder(_apiUrl)
		{
#if DEBUG
			Scheme = Uri.UriSchemeHttp
#else
			Scheme = Uri.UriSchemeHttps
#endif
		}.Uri;
	}
}