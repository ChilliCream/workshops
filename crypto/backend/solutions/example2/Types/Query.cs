using HotChocolate.Data.Filters;
using HotChocolate.Data.Sorting;
using HotChocolate.Resolvers;

namespace Demo.Types;

[QueryType]
public static class Query
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
}