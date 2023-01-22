namespace Demo.Types.Account;

[ExtendObjectType<User>]
public static class UserNode
{
    [ID(nameof(User))]
    [BindMember(nameof(User.Id))]
    public static int GetId([Parent] User user) => user.Id;

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
