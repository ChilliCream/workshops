using System.Text.Json;
using HotChocolate.Resolvers;
using HotChocolate.Types.Pagination;

namespace Demo.Types.Assets;

public sealed class AssetPriceChangeType : ObjectType
{
    protected override void Configure(IObjectTypeDescriptor descriptor)
    {
        descriptor
            .Name("AssetPriceChange")
            .IsOfType(IsAssetPriceChangeType);

        descriptor
            .ImplementsNode()
            .ResolveNodeWith<AssetPriceChangeType>(_ => ResolveNodeAsync(default!, default!, default!, default!));

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
            .Field<AssetPriceChangeType>(_ => GetHistoryAsync(default, default!, default!, default))
            .UsePaging<AssetPriceHistoryType>();
    }

    private static async Task<JsonElement?> ResolveNodeAsync(
        string id,
        [ScopedState("keyAndSpan")] SetState<KeyAndSpan> setKey,
        AssetPriceChangeByKeyDataLoader dataLoader,
        CancellationToken cancellationToken)
    {
        string[] parts = id.Split(':');
        ChangeSpan span = Enum.Parse<ChangeSpan>(parts[1]);
        var key = new KeyAndSpan(parts[0], span);
        setKey(key);
        return await dataLoader.LoadAsync(key, cancellationToken);
    }

    private static async Task<Connection<JsonElement>> GetHistoryAsync(
        [ScopedState] KeyAndSpan keyAndSpan,
        AssetPriceHistoryByKeyDataLoader assetPriceHistoryByKey,
        IResolverContext context,
        CancellationToken cancellationToken)
    {
        JsonElement history = await assetPriceHistoryByKey.LoadAsync(keyAndSpan, cancellationToken);
        return await history.GetProperty("entries").EnumerateArray().ToArray().ApplyCursorPaginationAsync(context, cancellationToken: cancellationToken);
    }

    private static bool IsAssetPriceChangeType(IResolverContext context, object resolverResult)
        => resolverResult is JsonElement element &&
            element.TryGetProperty("percentageChange", out _);

    [DataLoader(ServiceScope = DataLoaderServiceScope.OriginalScope)]
    internal static async Task<IReadOnlyDictionary<KeyAndSpan, JsonElement>> GetAssetPriceChangeByKey(
        IReadOnlyList<KeyAndSpan> keys,
        IHttpClientFactory clientFactory,
        CancellationToken cancellationToken)
    {
        using var client = clientFactory.CreateClient(Constants.PriceInfoService);
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
