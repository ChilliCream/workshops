using System.Text.Json;

namespace Demo.Types.Assets;

[Node]
[ExtendObjectType<AssetPrice>]
public static class AssetPriceNode
{
    [BindMember(nameof(AssetPrice.AssetId))]
    public static async Task<Asset> GetAssetAsync(
        [Parent] AssetPrice parent,
        AssetBySymbolDataLoader assetBySymbol,
        CancellationToken cancellationToken)
        => await assetBySymbol.LoadAsync(parent.Symbol!, cancellationToken);

    [GraphQLType<AssetPriceChangeType>]
    public static async Task<JsonElement> GetChangeAsync(
        ChangeSpan span,
        [ScopedState("keyAndSpan")] SetState<KeyAndSpan> setKey,
        [Parent] AssetPrice parent,
        AssetPriceChangeByKeyDataLoader assetPriceBySymbol,
        CancellationToken cancellationToken)
    {
        var key = new KeyAndSpan(parent.Symbol!, span);
        setKey(key);
        return await assetPriceBySymbol.LoadAsync(key, cancellationToken);
    }

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