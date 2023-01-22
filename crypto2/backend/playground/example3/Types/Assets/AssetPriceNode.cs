namespace Demo.Types.Assets;

[Node]
[ExtendObjectType<AssetPrice>]
public static class AssetPriceNode
{
    [DataLoader]
    internal static async Task<IReadOnlyDictionary<string, AssetPrice>> GetAssetPriceBySymbolAsync(
        IReadOnlyList<string> symbols,
        AssetContext context,
        CancellationToken cancellationToken)
        => await context.AssetPrices
            .Where(t => symbols.Contains(t.Symbol))
            .ToDictionaryAsync(t => t.Symbol!, cancellationToken);

    [DataLoader]
    internal static async Task<IReadOnlyDictionary<int, AssetPrice>> GetAssetPriceByIdAsync(
        IReadOnlyList<int> ids,
        AssetContext context,
        CancellationToken cancellationToken)
        => await context.AssetPrices
            .Where(t => ids.Contains(t.Id))
            .ToDictionaryAsync(t => t.Id, cancellationToken);

    [NodeResolver]
    public static async Task<AssetPrice> GetAssetPriceByIdAsync(
        int id,
        AssetPriceByIdDataLoader assetPriceById,
        CancellationToken cancellationToken)
        => await assetPriceById.LoadAsync(id, cancellationToken);
}