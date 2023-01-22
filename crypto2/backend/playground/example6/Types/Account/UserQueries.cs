namespace Demo.Types.Account;

[QueryType]
public static class UserQueries
{
    public static async Task<User?> GetMeAsync(
        [GlobalState] string? username,
        AssetContext context,
        CancellationToken cancellationToken)
    {
        if (username is null)
        {
            return null;
        }

        return await context.Users.FirstOrDefaultAsync(t => t.Name == username, cancellationToken);
    }
}
