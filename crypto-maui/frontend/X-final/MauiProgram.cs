using System;
using System.Net;
using System.Runtime.CompilerServices;
using CommunityToolkit.Maui;
using CommunityToolkit.Maui.Markup;
using Polly;

namespace MauiCrypto;

public static partial class MauiProgram
{
	public static MauiApp CreateMauiApp(UserService userService)
	{
		var builder = MauiApp.CreateBuilder();
		builder.UseMauiApp<App>()
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
		builder.Services.AddSingleton<ThemeService>();
		builder.Services.AddSingleton<IPreferences>(Preferences.Default);
		builder.Services.AddSingleton<ISecureStorage>(SecureStorage.Default);
		builder.Services.AddSingleton<CryptoGraphQLService>();
		builder.Services.AddSingleton<UserService>();

		builder.Services.AddMauiCryptoClient()
						.ConfigureHttpClient(
							client => client.BaseAddress = GetGraphQLUri(userService.GraphQLEndpoint),
							clientBuilder => clientBuilder
												.ConfigurePrimaryHttpMessageHandler(GetHttpMessageHandler)
												.AddTransientHttpErrorPolicy(builder => builder.WaitAndRetryAsync(3, sleepDurationProvider)))
						.ConfigureWebSocketClient(client => client.Uri = GetGraphQLStreamingUri(userService.GraphQLEndpoint));

		return builder.Build();

		static TimeSpan sleepDurationProvider(int attemptNumber) => TimeSpan.FromSeconds(Math.Pow(2, attemptNumber));
	}

	static IServiceCollection AddTransientWithShellRoute<TPage, TViewModel>(this IServiceCollection services) where TPage : BasePage<TViewModel>
																												where TViewModel : BaseViewModel
	{
		return services.AddTransientWithShellRoute<TPage, TViewModel>(AppShell.GetRoute<TPage, TViewModel>());
	}

	static DecompressionMethods GetDecompressionMethods() => DecompressionMethods.Deflate | DecompressionMethods.GZip;

	private static partial Uri GetGraphQLUri(in Uri uri);
	private static partial Uri GetGraphQLStreamingUri(in Uri uri);
	private static partial HttpMessageHandler GetHttpMessageHandler();
}