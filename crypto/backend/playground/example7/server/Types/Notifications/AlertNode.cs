using Demo.Types.Assets;

namespace Demo.Types.Notifications;

[Node]
[ExtendObjectType(typeof(Alert))]
public sealed class AlertNode
{
    [BindMember(nameof(Alert.AssetId))]
    public Task<Asset> GetAssetAsync(
        [Parent] Alert notification,
        AssetByIdDataLoader assetById,
        CancellationToken cancellationToken)
        => assetById.LoadAsync(notification.AssetId, cancellationToken);

    [NodeResolver]
    public static Task<Alert?> GetByIdAsync(
        int id,
        AssetContext context,
        CancellationToken cancellationToken)
        => context.Alerts.FirstOrDefaultAsync(t => t.Id == id, cancellationToken);

    [DataLoader("AlertExistsDataLoader")]
    public static async Task<IReadOnlyDictionary<int, bool>> AlertExistsAsync(
        IReadOnlyList<int> assetId,
        AssetContext context,
        CancellationToken cancellationToken)
        => await context.Alerts
            .Where(t => assetId.Contains(t.AssetId))
            .ToDictionaryAsync(t => t.AssetId, _ => true, cancellationToken);

    [DataLoader]
    public static async Task<ILookup<int, Alert>> GetAlertsByAssetIdDataLoaderAsync(
        IReadOnlyList<int> assetId,
        AssetContext context,
        CancellationToken cancellationToken)
    {
        var alerts = await context.Alerts
            .Where(t => assetId.Contains(t.AssetId))
            .ToListAsync(cancellationToken);

        return alerts.ToLookup(t => t.AssetId);
    }
}
