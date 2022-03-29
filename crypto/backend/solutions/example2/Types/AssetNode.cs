using Demo.DataLoader;

namespace Demo.Types;

[Node]
[ExtendObjectType(typeof(Asset))]
public sealed class AssetNode
{
    public async Task<AssetPrice> GetPriceAsync(
        [Parent] Asset asset,
        AssetPriceBySymbolDataLoader priceBySymbol,
        CancellationToken cancellationToken)
        => await priceBySymbol.LoadAsync(asset.Symbol!, cancellationToken);

    [NodeResolver]
    public static Task<Asset?> GetById(int id, AssetContext context)
        => context.Assets.FirstOrDefaultAsync(a => a.Id == id);
}
