namespace Demo.Types;

[ExtendObjectType<Asset>]
public static class AssetNode
{
    public static async Task<AssetPrice> GetPriceAsync(
        [Parent] Asset asset,
        AssetPriceBySymbolDataLoader priceBySymbol,
        CancellationToken cancellationToken)
        => await priceBySymbol.LoadAsync(asset.Symbol!, cancellationToken);

    [BindMember(nameof(Asset.ImageKey))]
    public static string? GetImageUrl(
        [Parent] Asset asset,
        HttpContext httpContext)
    {
        if (asset.ImageKey is null)
        {
            return null;
        }

        var scheme = httpContext.Request.Scheme;
        var host = httpContext.Request.Host.Value;
        return $"{scheme}://{host}/images/{asset.ImageKey}";
    }

    [DataLoader]
    internal static async Task<IReadOnlyDictionary<int, Asset>> GetAssetByIdAsync(
        IReadOnlyList<int> ids,
        AssetContext context,
        CancellationToken cancellationToken)
        => await context.Assets
            .Where(t => ids.Contains(t.Id))
            .ToDictionaryAsync(t => t.Id!, cancellationToken);
}