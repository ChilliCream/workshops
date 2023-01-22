namespace Demo.Types.Assets;

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

    public async Task<bool?> IsInWatchlistAsync(
        [Parent] Asset asset,
        [GlobalState] string? username,
        WatchlistByUserDataLoader watchListByUser,
        CancellationToken cancellationToken)
    {
        if (username is null)
        {
            return null;
        }

        HashSet<string>? symbols = await watchListByUser.LoadAsync(username, cancellationToken);

        if (symbols is null)
        {
            return false;
        }

        return symbols.Contains(asset.Symbol!);
    }

    [DataLoader]
    internal static async Task<IReadOnlyDictionary<string, Asset>> GetAssetBySlugAsync(
        IReadOnlyList<string> slugs,
        AssetContext context,
        CancellationToken cancellationToken)
        => await context.Assets
            .Where(t => slugs.Contains(t.Slug))
            .ToDictionaryAsync(t => t.Slug!, cancellationToken);

    [DataLoader]
    internal static async Task<IReadOnlyDictionary<string, Asset>> GetAssetBySymbolAsync(
        IReadOnlyList<string> symbols,
        AssetContext context,
        CancellationToken cancellationToken)
        => await context.Assets
            .Where(t => symbols.Contains(t.Symbol))
            .ToDictionaryAsync(t => t.Symbol!, cancellationToken);

    [DataLoader]
    internal static async Task<IReadOnlyDictionary<int, Asset>> GetAssetByIdAsync(
        IReadOnlyList<int> ids,
        AssetContext context,
        CancellationToken cancellationToken)
        => await context.Assets
            .Where(t => ids.Contains(t.Id))
            .ToDictionaryAsync(t => t.Id, cancellationToken);
}