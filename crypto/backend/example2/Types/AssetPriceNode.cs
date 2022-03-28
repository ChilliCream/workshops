namespace Demo.Types.Assets;

[Node]
[ExtendObjectType(typeof(AssetPrice), IgnoreProperties = new[] { nameof(AssetPrice.AssetId) })]
public sealed class AssetPriceNode
{
    [NodeResolver]
    public static async Task<AssetPrice?> GetByIdAsync(
        int id,
        AssetContext context,
        CancellationToken cancellationToken)
        => await context.AssetPrices.FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
}