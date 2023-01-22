using HotChocolate.Resolvers;

namespace Demo.Types.Assets;

[QueryType]
public static class AssetQueries
{
    [UsePaging]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Asset> GetAssets(AssetContext context, IResolverContext resolverContext)
        => resolverContext.ArgumentKind("order") is ValueKind.Null
            ? context.Assets.OrderBy(t => t.Symbol)
            : context.Assets;

    [NodeResolver]
    public static async Task<Asset?> GetAssetByIdAsync(
        int id,
        AssetByIdDataLoader assetById,
        CancellationToken cancellationToken)
        => await assetById.LoadAsync(id, cancellationToken);

    public static async Task<IEnumerable<Asset?>> GetAssetsById(
        [ID(nameof(Asset))] int[] ids,
        AssetByIdDataLoader assetById,
        CancellationToken cancellationToken)
        => await assetById.LoadAsync(ids, cancellationToken);

    public static async Task<Asset?> GetAssetBySymbolAsync(
        string symbol,
        AssetBySymbolDataLoader assetBySymbol,
        CancellationToken cancellationToken)
        => await assetBySymbol.LoadAsync(symbol, cancellationToken);

    public static async Task<IEnumerable<Asset?>> GetAssetsBySymbol(
        string[] symbols,
        AssetBySymbolDataLoader assetBySymbol,
        CancellationToken cancellationToken)
        => await assetBySymbol.LoadAsync(symbols, cancellationToken);

    public static async Task<Asset?> GetAssetBySlugAsync(
        string slug,
        AssetBySlugDataLoader assetBySlug,
        CancellationToken cancellationToken)
        => await assetBySlug.LoadAsync(slug, cancellationToken);

    public static async Task<IEnumerable<Asset?>> GetAssetsBySlug(
        string[] slugs,
        AssetBySlugDataLoader assetBySlug,
        CancellationToken cancellationToken)
        => await assetBySlug.LoadAsync(slugs, cancellationToken);
}