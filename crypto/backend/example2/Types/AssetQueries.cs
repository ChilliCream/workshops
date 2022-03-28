namespace Demo.Types.Assets;

[ExtendObjectType(OperationTypeNames.Query)]
public sealed class AssetQueries
{
    [UsePaging]
    public IQueryable<Asset> GetAssets(AssetContext context)
        => context.Assets;

    public async Task<Asset?> GetAssetById(
        [ID(nameof(Asset))] int id,
        AssetContext context,
        CancellationToken cancellationToken)
        => await context.Assets.FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
}
