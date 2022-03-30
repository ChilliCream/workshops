# REST Endpoints

```
https://ccc-workshop-eu-functions.azurewebsites.net/api/asset/price/change?symbol=BTC&span=Day
```

```
https://ccc-workshop-eu-functions.azurewebsites.net/api/asset/price/change?symbols=ADA,BTC&span=Day
```

```csharp
using System.Text.Json;
using HotChocolate.Resolvers;

namespace Demo.Types.Assets;

public sealed class AssetPriceChangeType : ObjectType
{
    protected override void Configure(IObjectTypeDescriptor descriptor)
    {
        descriptor
            .Name("AssetPriceChange")
            .IsOfType(IsAssetPriceChangeType);

        descriptor
            .Field("id")
            .Type<NonNullType<IdType>>()
            .FromJson(obj =>
            {
                if (obj.TryGetProperty("symbol", out var symbol) &&
                    obj.TryGetProperty("span", out var span))
                {
                    return $"{symbol.GetString()}:{span.GetString()}";
                }

                return null;
            });

        descriptor
            .Field("percentageChange")
            .Type<NonNullType<FloatType>>()
            .FromJson();
    }

    private static bool IsAssetPriceChangeType(IResolverContext context, object resolverResult)
        => resolverResult is JsonElement element &&
            element.TryGetProperty("percentageChange", out _);
}
```

```csharp
using System.Text.Json;

namespace Demo.DataLoader;

public abstract class HttpBatchDataLoader<TKey>
    : BatchDataLoader<TKey, JsonElement>
    where TKey : notnull
{
    protected HttpBatchDataLoader(
        IHttpClientFactory clientFactory,
        IBatchScheduler batchScheduler,
        DataLoaderOptions? options = null)
        : base(batchScheduler, options)
    {
        ClientFactory = clientFactory ?? throw new ArgumentNullException(nameof(clientFactory));
    }

    public IHttpClientFactory ClientFactory { get; }

    protected sealed override async Task<IReadOnlyDictionary<TKey, JsonElement>> LoadBatchAsync(
        IReadOnlyList<TKey> keys,
        CancellationToken cancellationToken)
    {
        using var client = ClientFactory.CreateClient(Constants.PriceInfoService);
        return await LoadBatchAsync(keys, client, cancellationToken);
    }

    protected abstract Task<IReadOnlyDictionary<TKey, JsonElement>> LoadBatchAsync(
        IReadOnlyList<TKey> keys,
        HttpClient client,
        CancellationToken cancellationToken);
}
```

```csharp
namespace Demo.Types.Assets;

public enum ChangeSpan
{
    All,
    Hour,
    Day,
    Week,
    Month,
    Year
}
```

```csharp
namespace Demo.Types.Assets;

public readonly record struct KeyAndSpan(string Symbol, ChangeSpan Span);
```

```csharp
using System.Text.Json;
using Demo.Types.Assets;

namespace Demo.DataLoader;

public sealed class AssetPriceChangeDataLoader : HttpBatchDataLoader<KeyAndSpan>
{
    public AssetPriceChangeDataLoader(
        IHttpClientFactory clientFactory,
        IBatchScheduler batchScheduler,
        DataLoaderOptions? options = null)
        : base(clientFactory, batchScheduler, options)
    {
    }

    protected override async Task<IReadOnlyDictionary<KeyAndSpan, JsonElement>> LoadBatchAsync(
        IReadOnlyList<KeyAndSpan> keys,
        HttpClient client,
        CancellationToken cancellationToken)
    {
        var map = new Dictionary<KeyAndSpan, JsonElement>();

        foreach (var group in keys.GroupBy(t => t.Span))
        {
            string symbols = string.Join(",", group.Select(t => t.Symbol));
            using var request = new HttpRequestMessage(
                HttpMethod.Get,
                $"api/asset/price/change?symbols={symbols}&span={group.Key}");
            using var response = await client.SendAsync(request, cancellationToken);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsByteArrayAsync(cancellationToken);
            var document = JsonDocument.Parse(content);
            var root = document.RootElement;

            foreach (JsonElement priceInfo in root.EnumerateArray())
            {
                string symbol = priceInfo.GetProperty("symbol").GetString()!;
                map.Add(new(symbol, group.Key), priceInfo);
            }
        }

        return map;
    }
}
```

```csharp
builder.Services
    .AddHttpClient(Constants.PriceInfoService, c => c.BaseAddress = new("https://ccc-workshop-eu-functions.azurewebsites.net"));
```

```csharp
[GraphQLType(typeof(AssetPriceChangeType))]
public async Task<JsonElement> GetChangeAsync(
    ChangeSpan span,
    [Parent] AssetPrice parent,
    AssetPriceChangeDataLoader assetPriceBySymbol,
    CancellationToken cancellationToken)
{
    return await assetPriceBySymbol.LoadAsync(new KeyAndSpan(parent.Symbol!, span), cancellationToken);
}
```

```csharp
using System.Text.Json;

namespace Demo.Types.Assets;

[Node]
[ExtendObjectType(typeof(AssetPrice), IgnoreProperties = new[] { nameof(AssetPrice.AssetId) })]
public sealed class AssetPriceNode
{
    public async Task<Asset> GetAssetAsync(
        [Parent] AssetPrice parent,
        AssetBySymbolDataLoader assetBySymbol,
        CancellationToken cancellationToken)
        => await assetBySymbol.LoadAsync(parent.Symbol!, cancellationToken);

    [GraphQLType(typeof(AssetPriceChangeType))]
    public async Task<JsonElement> GetChangeAsync(
        ChangeSpan span,
        [Parent] AssetPrice parent,
        AssetPriceChangeDataLoader assetPriceBySymbol,
        CancellationToken cancellationToken)
    {
        return await assetPriceBySymbol.LoadAsync(new KeyAndSpan(parent.Symbol!, span), cancellationToken);
    }

    [NodeResolver]
    public static Task<AssetPrice> GetByIdAsyncAsync(
        int id,
        AssetPriceByIdDataLoader dataLoader,
        CancellationToken cancellationToken)
        => dataLoader.LoadAsync(id, cancellationToken);
}
```

```bash
dotnet run
```

```csharp
namespace Demo.Types.Assets;

public sealed class AssetPriceHistoryType : ObjectType
{
    protected override void Configure(IObjectTypeDescriptor descriptor)
    {
        descriptor
            .Name("AssetPriceHistory");

        descriptor
            .Field("epoch")
            .Type<NonNullType<IntType>>()
            .FromJson();

        descriptor
            .Field("price")
            .Type<NonNullType<FloatType>>()
            .FromJson();
    }
}
```

```graphql
type AssetPriceHistory {
  epoch: Int! @fromJson
  price: Float! @fromJson
}
```

```csharp
using System.Text.Json;
using Demo.Types.Assets;

namespace Demo.DataLoader;

public sealed class AssetPriceHistoryDataLoader : HttpBatchDataLoader<KeyAndSpan>
{
    public AssetPriceHistoryDataLoader(
        IHttpClientFactory clientFactory,
        IBatchScheduler batchScheduler,
        DataLoaderOptions? options = null)
        : base(clientFactory, batchScheduler, options)
    {
    }

    protected override async Task<IReadOnlyDictionary<KeyAndSpan, JsonElement>> LoadBatchAsync(
        IReadOnlyList<KeyAndSpan> keys,
        HttpClient client,
        CancellationToken cancellationToken)
    {
        var map = new Dictionary<KeyAndSpan, JsonElement>();

        foreach (var group in keys.GroupBy(t => t.Span))
        {
            string symbols = string.Join(",", group.Select(t => t.Symbol));
            using var request = new HttpRequestMessage(
                HttpMethod.Get,
                $"api/asset/price/history?symbols={symbols}&span={group.Key}");
            using var response = await client.SendAsync(request, cancellationToken);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsByteArrayAsync(cancellationToken);
            var document = JsonDocument.Parse(content);
            var root = document.RootElement;

            foreach (JsonElement priceInfo in root.EnumerateArray())
            {
                string symbol = priceInfo.GetProperty("symbol").GetString()!;
                map.Add(new(symbol, group.Key), priceInfo);
            }
        }

        return map;
    }
}
```

```csharp
private class Resolvers
{
    public async Task<Connection<JsonElement>> GetHistoryAsync(
        [ScopedState] ChangeSpan span,
        [Parent] JsonElement parent,
        AssetPriceHistoryDataLoader dataLoader,
        IResolverContext context,
        CancellationToken cancellationToken)
    {
        string symbol = parent.GetProperty("symbol").GetString()!;
        JsonElement history = await dataLoader.LoadAsync(new KeyAndSpan(symbol, span), cancellationToken);
        return await history.GetProperty("entries").EnumerateArray().ToArray().ApplyCursorPaginationAsync(context, cancellationToken: cancellationToken);
    }
}
```

```csharp
descriptor
    .Field<Resolvers>(t => t.GetHistoryAsync(default, default, default!, default!, default))
    .UsePaging<AssetPriceHistoryType>();
```

```csharp
using System.Text.Json;
using HotChocolate.Resolvers;
using HotChocolate.Types.Pagination;
using HotChocolate.Types.Pagination.Extensions;

namespace Demo.Types.Assets;

public sealed class AssetPriceChangeType : ObjectType
{
    protected override void Configure(IObjectTypeDescriptor descriptor)
    {
        descriptor
            .Name("AssetPriceChange")
            .IsOfType(IsAssetPriceChangeType);

        descriptor
            .Field("id")
            .Type<NonNullType<IdType>>()
            .FromJson(obj =>
            {
                if (obj.TryGetProperty("symbol", out var symbol) &&
                    obj.TryGetProperty("span", out var span))
                {
                    return $"{symbol.GetString()}:{span.GetString()}";
                }

                return null;
            });

        descriptor
            .Field("percentageChange")
            .Type<NonNullType<FloatType>>()
            .FromJson();

        descriptor
            .Field<Resolvers>(t => t.GetHistoryAsync(default, default, default!, default!, default))
            .UsePaging<AssetPriceHistoryType>();
    }

    private static bool IsAssetPriceChangeType(IResolverContext context, object resolverResult)
        => resolverResult is JsonElement element &&
            element.TryGetProperty("percentageChange", out _);

    private class Resolvers
    {
        public async Task<Connection<JsonElement>> GetHistoryAsync(
            [ScopedState] ChangeSpan span,
            [Parent] JsonElement parent,
            AssetPriceHistoryDataLoader dataLoader,
            IResolverContext context,
            CancellationToken cancellationToken)
        {
            string symbol = parent.GetProperty("symbol").GetString()!;
            JsonElement history = await dataLoader.LoadAsync(new KeyAndSpan(symbol, span), cancellationToken);
            return await history.GetProperty("entries").EnumerateArray().ToArray().ApplyCursorPaginationAsync(context, cancellationToken: cancellationToken);
        }
    }
}
```

```csharp
[GraphQLType(typeof(AssetPriceChangeType))]
public async Task<JsonElement> GetChangeAsync(
    ChangeSpan span,
    [ScopedState("span")] SetState<ChangeSpan> setSpan,
    [Parent] AssetPrice parent,
    AssetPriceChangeDataLoader assetPriceBySymbol,
    CancellationToken cancellationToken)
{
    setSpan(span);
    return await assetPriceBySymbol.LoadAsync(new KeyAndSpan(parent.Symbol!, span), cancellationToken);
}
```

```csharp
using System.Text.Json;

namespace Demo.Types.Assets;

[Node]
[ExtendObjectType(typeof(AssetPrice), IgnoreProperties = new[] { nameof(AssetPrice.AssetId) })]
public sealed class AssetPriceNode
{
    public async Task<Asset> GetAssetAsync(
        [Parent] AssetPrice parent,
        AssetBySymbolDataLoader assetBySymbol,
        CancellationToken cancellationToken)
        => await assetBySymbol.LoadAsync(parent.Symbol!, cancellationToken);

    [GraphQLType(typeof(AssetPriceChangeType))]
    public async Task<JsonElement> GetChangeAsync(
        ChangeSpan span,
        [ScopedState("span")] SetState<ChangeSpan> setSpan,
        [Parent] AssetPrice parent,
        AssetPriceChangeDataLoader assetPriceBySymbol,
        CancellationToken cancellationToken)
    {
        setSpan(span);
        return await assetPriceBySymbol.LoadAsync(new KeyAndSpan(parent.Symbol!, span), cancellationToken);
    }

    [NodeResolver]
    public static Task<AssetPrice> GetByIdAsyncAsync(
        int id,
        AssetPriceByIdDataLoader dataLoader,
        CancellationToken cancellationToken)
        => dataLoader.LoadAsync(id, cancellationToken);
}
```

