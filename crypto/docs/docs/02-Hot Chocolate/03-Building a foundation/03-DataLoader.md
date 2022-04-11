# DataLoader

As of now, we can fetch a list of assets through the `assets` field. But this will only yield the base information about our `Asset`. Next, we want to introduce the `AssetPrice` to our type system and connect it with the `Asset` entity.

We want to be able to query the asset price together with the asset like the following.

```graphql
query {
  assets {
    nodes {
      symbol
      price {
        lastPrice
      }
    }
  }
}
```

Since `Asset` and `AssetPrice` are exposed through the same `DbContext`, we could use projections and delegate this work to the `DbContext`. But in many use-cases, we can more efficiently handle loading entities with a **DataLoader**.

## DataLoader

A **DataLoader** is a utility to ask for an entity by its key. Instead of resolving the entity, the DataLoader will return with a promise of the result, but will not start fetching the data immediately.

The **DataLoader** will only start fetching data once the complete dependency tree has been analyzed by the execution engine. This means all requests from all requesting resolvers are batched in one call to the database.

Think about the following query.

```graphql
query {
  assets {
    nodes {
      symbol
      price {
        lastPrice
      }
    }
  }
}
```

If we did a naive implementation, we would fetch the `price` information for each `asset` node individually. With deeper trees, the same price entities could also be connected to other parts in the graph and exaggerate this problem, causing hundreds of queries to the database.

The **DataLoader** instead batches requests to the database or any other data source and uses a request-bound cache so that repeated requests for the same item will be served from that cache that is only loaded once. Another benefit is that this guarantees that objects used multiple times in a query graph have a consistent state throughout the request.

Let's first create a new directory called `DataLoaders` in the `example2` directory.

```bash
mkdir DataLoaders
```

Next, we will create a file called `AssetPriceBySymbolDataLoader` in there and copy the following code into the file.

```csharp title="/DataLoader/AssetPriceBySymbolDataLoader.cs"
namespace Demo.DataLoader;

public sealed class AssetPriceBySymbolDataLoader : BatchDataLoader<string, AssetPrice>
{
    private readonly IDbContextFactory<AssetContext> _contextFactory;

    public AssetPriceBySymbolDataLoader(
        IDbContextFactory<AssetContext> contextFactory,
        IBatchScheduler batchScheduler,
        DataLoaderOptions? options = null)
        : base(batchScheduler, options)
    {
        _contextFactory = contextFactory ??
            throw new ArgumentNullException(nameof(contextFactory));
    }

    protected override async Task<IReadOnlyDictionary<string, AssetPrice>> LoadBatchAsync(
        IReadOnlyList<string> keys,
        CancellationToken cancellationToken)
    {
        await using var context = await _contextFactory.CreateDbContextAsync(cancellationToken);
        return await context.AssetPrices.Where(t => keys.Contains(t.Symbol)).ToDictionaryAsync(t => t.Symbol!, cancellationToken);
    }
}
```

The `AssetPriceBySymbolDataLoader` inherits from a class called `BatchDataLoader`, which allows us to batch multiple requests to the database. There are other kinds of **DataLoader** for more specific use-cases.

**remark: instead of injecting the context factory, we could register an interface with DI that resolves to an concrete dbContext. Would mean less clutter in the dataloaders, but a bit more work when registering the DbContext/Factory**

The `LoadBatchAsync` method is invoked when the execution engine wants to retrieve data for a type. The `keys` parameter passed into the `LoadBatchAsync` are all the symbols for which we shall resolve entities.

Now that we have a **DataLoader** to fetch the `AssetPrice`, let's introduce the price field to our `Asset` type.

We will create a new file called `AssetNode.cs` located in the `Types` directory.

Copy the following code into the file.

```csharp title="/Types/AssetNode.cs"
namespace Demo.Types;

[ExtendObjectType(typeof(Asset))]
public sealed class AssetNode
{
    public async Task<AssetPrice> GetPriceAsync(
        [Parent] Asset asset,
        AssetPriceBySymbolDataLoader priceBySymbol,
        CancellationToken cancellationToken)
        => await priceBySymbol.LoadAsync(asset.Symbol!, cancellationToken);
}
```

:::note

The `Parent` attribute marks a parameter that represent the runtime value of the declaring GraphQL type. In this case, we are resolving the `price` field of the `Asset` type, so we want to inject the `Asset` instance into our resolver.

:::

The class `AssetNode` is annotated with the `ExtendObjectTypeAttribute`, allowing us to extend an existing type `Asset` with additional fields.

The above code defines a new field on the `Asset` type:

```graphql
extend type Asset {
  price: AssetPrice
}
```

:::note

The **HotChocolate** source generator will automatically add all types that are annotated with one of the following attributes the the GraphQL schema.

- ExtendObjectTypeAttribute
- ObjectTypeAttribute
- InterfaceTypeAttribute
- UnionTypeAttribute
- EnumTypeAttribute
- InputObjectTypeAttribute

Also, all classes extending the following classes will be automatically added.

- ObjectType
- InterfaceType
- UnionType
- EnumType
- InputObjectType
- ScalarType
- ObjectTypeExtension
- InterfaceTypeExtension
- UnionTypeExtension
- InputObjectTypeExtension
- EnumTypeExtension

Last, all classes inheriting from `IDataLoader`, i.e. all **DataLoader**, are also added. This greatly reduced the number of types that need to be added to the schema manually.

:::

To register the generated GraphQL module with the GraphQL configuration, we need to head over to the `Program.cs` and chain in `AddAssetTypes` to the GraphQL configuration builder.

:::note

**remark: maybe it's only me, but what is the 'ModuleInfo.cs'? Where does it come from? Doesn't this contradict the preceding note about 'automatically' adding? And where is 'AddAssetType()' defined?**

The GraphQL module name is defined in the `ModuleInfo.cs` file.

```csharp title="/ModuleInfo.cs"
[assembly: Module("AssetTypes")]
```

:::

```csharp
builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .AddAssetTypes()
    .RegisterDbContext<AssetContext>(DbContextKind.Pooled);
```

The `Program.cs` should now look like the following.

```csharp title="/Program.cs"
var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddHttpContextAccessor()
    .AddCors()
    .AddHelperServices();

builder.Services
    .AddPooledDbContextFactory<AssetContext>(o => o.UseSqlite("Data Source=assets.db"));

builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .AddAssetTypes()
    .RegisterDbContext<AssetContext>(DbContextKind.Pooled);

var app = builder.Build();

app.UseCors(c => c.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
app.UseStaticFiles();
app.MapGraphQL();

app.Run();
```

Let us test our new **DataLoader**.

```bash
dotnet run
```

Open `http://localhost:5000/graphql` and refresh the schema.

![Banana Cake Pop - Refresh Schema](../images/example2-part1-bcp1.png)

Execute the following query.

```graphql
query {
  assets {
    nodes {
      symbol
      price {
        lastPrice
      }
    }
  }
}
```

After executing the above query, we can examine the SQL commands performed by executing the GraphQL request.
We can see that two commands were executed. The first request fetched the first page of the `Asset` entities.

```sql
SELECT
  "a"."Id",
  "a"."Color",
  "a"."Description",
  "a"."ImageKey",
  "a"."Name",
  "a"."Slug",
  "a"."Symbol",
  "a"."Website",
  "a"."WhitePaper"
FROM "Assets" AS "a"
ORDER BY "a"."Symbol"
LIMIT @__p_0
```

**remark: the query doesn't include a limit, but the SQL does show one**

The second request will fetch the `AssetPrice` for each `Asset` fetched in the initial request.

```sql
SELECT
  "a"."Id",
  "a"."AssetId",
  "a"."Change24Hour",
  "a"."CirculatingSupply",
  "a"."Currency",
  "a"."High24Hour",
  "a"."LastPrice",
  "a"."Low24Hour",
  "a"."MarketCap",
  "a"."MaxSupply",
  "a"."ModifiedAt",
  "a"."Open24Hour",
  "a"."Symbol",
  "a"."TradableMarketCapRank",
  "a"."TradingActivity",
  "a"."Volume24Hour",
  "a"."VolumePercentChange24Hour"
FROM "AssetPrices" AS "a"
WHERE "a"."Symbol" IN ('ANKR', 'AMP', 'ALICE', 'ALGO', 'ALCX', 'AIOZ', 'AERGO', 'ADA', 'ACH', 'AAVE')
```

## Summary

In the third part, we have learned how to add fields to an existing type by using the `ExtendObjectTypeAttribute`. Further, we have explored how we can efficiently fetch data by using **DataLoader**.
