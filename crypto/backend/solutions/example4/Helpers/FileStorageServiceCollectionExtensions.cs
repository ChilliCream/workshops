using Demo.Transport;

namespace Microsoft.Extensions.DependencyInjection;

public static class HelersServiceCollectionExtensions
{
    public static IServiceCollection AddHelperServices(this IServiceCollection services)
        => services
            .AddSingleton<IFileStorage>(_ => new FileSystemStorage("./wwwroot/images"))
            .AddHostedService<AssetPriceChangeProcessor>()
            .AddGraphQLServer()
            .RegisterService<IFileStorage>()
            .AddHttpRequestInterceptor<CustomHttpRequestInterceptor>()
            .Services;
}