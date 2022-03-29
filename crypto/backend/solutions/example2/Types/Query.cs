namespace Demo.Types;

public class Query
{
    [UsePaging]
    public IQueryable<Asset> GetAssets(AssetContext context)
        => context.Assets.OrderBy(t => t.Symbol);

    public async Task<Asset?> GetAssetById(
        [ID(nameof(Asset))] int id,
        AssetContext context,
        CancellationToken cancellationToken)
        => await context.Assets.FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
}