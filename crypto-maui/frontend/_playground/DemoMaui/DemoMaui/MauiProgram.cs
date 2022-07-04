using DemoMaui.GraphQL;

namespace DemoMaui;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();

        builder.Services
            .AddCryptoClient()
            .ConfigureHttpClient(c => c.BaseAddress = new Uri("https://api-crypto-workshop.chillicream.com/graphql"))
            .ConfigureWebSocketClient(c => c.Uri = new Uri("wss://api-crypto-workshop.chillicream.com/graphql"));

        builder.Services.AddTransient<MainPage>();
        
        builder
            .UseMauiApp<App>()
            .ConfigureFonts(
                fonts =>
                {
                    fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                    fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
                });

        return builder.Build();
    }
}