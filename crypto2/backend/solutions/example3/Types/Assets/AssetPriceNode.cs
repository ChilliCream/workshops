using System.Text.Json;

namespace Demo.Types.Assets;

[Node]
[ExtendObjectType(typeof(AssetPrice), IgnoreProperties = new[] { nameof(AssetPrice.AssetId) })]
public sealed class AssetPriceNode
{
    public async Task<Asset> GetAssetAsync(
        [Parent] AssetPrice parent,
        AssetBySymbolDataLoader assetBySymbol,
        CancellationToken cancellationToken)
        => await assetBySymbol.LoadAsync(parent.Symbol!, cancellationToken);

    [GraphQLType(typeof(AssetPriceChangeType))]
    public async Task<JsonElement> GetChangeAsync(
        ChangeSpan span,
        [ScopedState("keyAndSpan")] SetState<KeyAndSpan> setKey,
        [Parent] AssetPrice parent,
        AssetPriceChangeDataLoader assetPriceBySymbol,
        CancellationToken cancellationToken)
    {
        var key = new KeyAndSpan(parent.Symbol!, span);
        setKey(key);
        return await assetPriceBySymbol.LoadAsync(key, cancellationToken);
    }

    [NodeResolver]
    public static Task<AssetPrice> GetByIdAsyncAsync(
        int id,
        AssetPriceByIdDataLoader dataLoader,
        CancellationToken cancellationToken)
        => dataLoader.LoadAsync(id, cancellationToken);
}