using Demo.Types.Assets;

namespace Demo.Types.Account;

[Node]
[ExtendObjectType<Watchlist>]
public sealed class WatchlistNode
{
    [BindMember(nameof(Watchlist.User))]
    public Task<User> GetUserAsync(
        [Parent] Watchlist watchlist,
        AssetContext context,
        CancellationToken cancellationToken)
        => context.Users.FirstAsync(t => t.Name == watchlist.User, cancellationToken);

    [UsePaging]
    [BindMember(nameof(Watchlist.SymbolsData))]
    public async Task<IEnumerable<Asset>> GetAssetsAsync(
        [Parent] Watchlist watchlist,
        AssetBySymbolDataLoader assetBySymbol,
        CancellationToken cancellationToken)
        => await assetBySymbol.LoadAsync(watchlist.GetSymbols(), cancellationToken);

    [DataLoader]
    internal static async Task<IReadOnlySet<string>?> GetWatchlistByUserAsync(
        string userName,
        AssetContext context,
        CancellationToken cancellationToken)
    {
        Watchlist? watchlist = await context.Watchlists.FirstOrDefaultAsync(t => t.User == userName, cancellationToken: cancellationToken);

        if (watchlist is null)
        {
            return null;
        }

        return watchlist.GetSymbols().ToHashSet();
    }

    [NodeResolver]
    public static Task<Watchlist?> GetById(
        int id,
        [GlobalState] string? username,
        AssetContext context,
        CancellationToken cancellationToken)
        => context.Watchlists.FirstOrDefaultAsync(
            a => a.Id == id && a.User == username,
            cancellationToken);
}