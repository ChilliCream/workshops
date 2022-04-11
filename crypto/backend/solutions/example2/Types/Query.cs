using HotChocolate.Language;
using HotChocolate.Resolvers;

namespace Demo.Types;

public class Query
{
    [UsePaging]
    [UseFiltering(typeof(AssetFilterInputType))]
    [UseSorting(typeof(AssetSortInputType))]
    public IQueryable<Asset> GetAssets(AssetContext context, IResolverContext resolverContext)
        => resolverContext.ArgumentLiteral<IValueNode>("order").Kind is SyntaxKind.NullValue
            ? context.Assets.OrderBy(t => t.Symbol)
            : context.Assets;

    public async Task<Asset?> GetAssetByIdAsync(
        [ID(nameof(Asset))] int id,
        AssetByIdDataLoader assetById,
        CancellationToken cancellationToken)
        => await assetById.LoadAsync(id, cancellationToken);
}