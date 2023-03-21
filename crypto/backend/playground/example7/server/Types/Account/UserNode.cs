using Demo.Types.Notifications;

namespace Demo.Types.Account;

[ExtendObjectType<User>]
public static class UserNode
{
    [ID(nameof(User))]
    [BindMember(nameof(User.Id))]
    public static int GetId([Parent] User user) => user.Id;

    public static Task<Watchlist?> GetWatchlistAsync(
        [GlobalState] string username,
        AssetContext context,
        CancellationToken cancellationToken)
        => context.Watchlists.FirstOrDefaultAsync(t => t.User == username, cancellationToken);

    [UsePaging(ConnectionName = "UserAlert")]
    public static IQueryable<Alert>? GetAlerts(
        AssetContext context,
        [GlobalState] string username)
        => context.Alerts.Where(t => t.Username == username).OrderBy(t => t.Asset!.Symbol);

    [UsePaging(IncludeTotalCount = true)]
    public static IQueryable<Notification>? GetNotifications(
        AssetContext context,
        [GlobalState] string username,
        ReadStatus status = ReadStatus.All)
        => status switch
        {
            ReadStatus.Read => context.Notifications.Where(t => t.Username == username && t.Read).OrderBy(t => t.Symbol),
            ReadStatus.Unread => context.Notifications.Where(t => t.Username == username && !t.Read).OrderBy(t => t.Symbol),
            _ => context.Notifications.Where(t => t.Username == username).OrderBy(t => t.Symbol),
        };

    [BindMember(nameof(User.ImageKey))]
    public static string? GetImageUrl(
        [Parent] User user,
        HttpContext httpContext)
    {
        if (user.ImageKey is null)
        {
            return null;
        }

        var scheme = httpContext.Request.Scheme;
        var host = httpContext.Request.Host.Value;
        return $"{scheme}://{host}/images/{user.ImageKey}";
    }

}
