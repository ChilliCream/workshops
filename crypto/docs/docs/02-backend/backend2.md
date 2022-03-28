# Asset Price Ticker - Part 2

## Fetch Asset by ID

```csharp
public async Task<Asset?> GetAssetById(
    int id,
    AssetContext context,
    CancellationToken cancellationToken)
    => await context.Assets.FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
```

```csharp title="/Query.cs"
namespace Demo.Types;

public class Query
{
    public IQueryable<Asset> GetAssets(AssetContext context)
        => context.Assets;

    public async Task<Asset?> GetAssetById(
        int id,
        AssetContext context,
        CancellationToken cancellationToken)
        => await context.Assets.FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
}
```



