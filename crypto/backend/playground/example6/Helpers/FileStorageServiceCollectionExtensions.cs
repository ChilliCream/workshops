using System.Net;

namespace Microsoft.Extensions.DependencyInjection;

public static class HelersServiceCollectionExtensions
{
    public static IServiceCollection AddHelperServices(this IServiceCollection services)
        => services
            .AddSingleton<IFileStorage>(_ => new FileSystemStorage("./wwwroot/images"))
            .AddHostedService<AssetPriceChangeProcessor>()
            .AddGraphQLServer()
            .RegisterService<IFileStorage>()
            .AddHttpRequestInterceptor<Demo.Transport.CustomHttpRequestInterceptor>()
            .AddSocketSessionInterceptor<Demo.Transport.CustomSocketSessionInterceptor>()
            .Services;
}