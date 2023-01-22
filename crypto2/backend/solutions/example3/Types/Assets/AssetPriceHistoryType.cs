using System.Text.Json;

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

    [DataLoader(ServiceScope = DataLoaderServiceScope.OriginalScope)]
    internal static async Task<IReadOnlyDictionary<KeyAndSpan, JsonElement>> GetAssetPriceHistoryByKey(
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