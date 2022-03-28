using Demo.Data;
using Microsoft.EntityFrameworkCore;

namespace Demo.Types.Assets;

[Node]
[ExtendObjectType(typeof(Asset))]
public sealed class AssetNode
{
    [BindMember(nameof(Asset.ImageKey))]
    public string? GetImageUrl([Parent] Asset asset, [Service] IHttpContextAccessor httpContextAccessor)
    {
        if (asset.ImageKey is null)
        {
            return null;
        }

        string? scheme = httpContextAccessor.HttpContext?.Request.Scheme;
        string? host = httpContextAccessor.HttpContext?.Request.Host.Value;
        if (scheme is null || host is null)
        {
            return null;
        }

        return $"{scheme}://{host}/images/{asset.ImageKey}";
    }

    [NodeResolver]
    public static Task<Asset?> GetById(int id, AssetContext context)
        => context.Assets.FirstOrDefaultAsync(a => a.Id == id);
}
