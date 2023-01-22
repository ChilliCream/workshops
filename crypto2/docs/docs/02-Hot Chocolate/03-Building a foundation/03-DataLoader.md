# DataLoader

As of now, we can fetch multiple assets through the `assets` field. But this will only yield the base information about our `Asset`. Next, we want to introduce the `AssetPrice` to our type system and connect it with the `Asset` entity.

We want to be able to query the asset price together with the asset like the following.

```graphql
query {
  assets {
    nodes {
      price {
        lastPrice
      }
    }
  }
}
```

Since `Asset` and `AssetPrice` are exposed through the same `DbContext`, we could use projections and delegate this work to the `DbContext`. But in many use-cases, we can more efficiently handle loading entities with **DataLoader**.

## DataLoader

**DataLoader** is a utility to ask for an entity by its key. Instead of resolving the entity, the DataLoader will only return us with a promise of the result but will not start fetching the data.

The **DataLoader** will only start fetching data once the execution engine runs out of work. This means we can batch the requests from all requesting resolvers in one go.

Think about the following query.

```graphql
query {
  assets {
    nodes {
      price {
        lastPrice
      }
    }
  }
}
```

If we did a naive implementation, we would fetch multiple times from the database. With deeper trees, the same price entities could also be connected to other parts in the graph and exaggerate this problem, causing hundreds of queries to the database.

The **DataLoader** instead batches requests to the database or any other data source and uses a request-bound cache so that repeated requests for the same item will be served from that cache instead of fetching it from the database. This also has a second benefit since it guarantees that objects used multiple times in a query graph have a consistent state throughout the request.

First, we will create a file called `DataLoaders` located in the `Types` directory.
Copy the following code into the file.

```csharp title="/DataLoader/AssetPriceBySymbolDataLoader.cs"
namespace Demo.Types;

public static class DataLoaders
{
    [DataLoader(ServiceScope = DataLoaderServiceScope.DataLoaderScope)]
    internal static async Task<IReadOnlyDictionary<string, AssetPrice>> GetAssetPriceBySymbolAsync(
        IReadOnlyList<string> symbols,
        AssetContext context,
        CancellationToken cancellationToken)
        => await context.AssetPrices
            .Where(t => symbols.Contains(t.Symbol))
            .ToDictionaryAsync(t => t.Symbol!, cancellationToken);
}
```

The method `GetAssetPriceBySymbolAsync` in this class represents our **DataLoader**. Our class `DataLoaders` could contain multiple of these **DataLoader** methods. Each **DataLoader** method must be `internal` or `public` and also be static. Further it must be annotated with the `DataLoaderAttribute`.

:::note

We recommend co-locating the **DataLoader** methods with the GraphQL specific types. As we go forward with this workshop we will refactor the code and move this code to the extension code of `AssetPrice`.

:::

The Hot Chocolate source generator will pick up these **DataLoader** methods and generate an actual class for our **DataLoader** that handles all the code to batch and cache data.

In our case the source generator created the `AssetPriceBySymbolDataLoader` class that inherits from a class called `BatchDataLoader`, which allows us to batch multiple requests to the database. There are other kinds of **DataLoader** for more specific use-cases.

The `GetAssetPriceBySymbolAsync` method is invoked when the execution engine wants to execute a batch. The `symbols` parameter passed into the `GetAssetPriceBySymbolAsync` are all the symbols for which we shall resolve entities.

The `DataLoaderAttribute` in our case has the `ServiceScope` set to `DataLoaderServiceScope.DataLoaderScope`. This is done so that the source generator will create a service scope around the execution of the **DataLoader** to avoid thread access exceptions from the `DBContext`.

In our case this is a good option as a default to all our **DataLoader**. In order for us not to repeat this for every DataLoader let's head over to the `Properties/ModuleInfo.cs` and add there the `DataLoaderDefaultsAttribute`.

```csharp title="/Properties/ModuleInfo.cs"
[assembly: Module("Types")]
[assembly: DataLoaderDefaults(
    ServiceScope = DataLoaderServiceScope.DataLoaderScope)]
```

With this default added we now can simplify our argument on the `DataLoaderAttribute`.

```csharp title="/DataLoader/AssetPriceBySymbolDataLoader.cs"
namespace Demo.Types;

public static class DataLoaders
{
    [DataLoader]
    internal static async Task<IReadOnlyDictionary<string, AssetPrice>> GetAssetPriceBySymbolAsync(
        IReadOnlyList<string> symbols,
        AssetContext context,
        CancellationToken cancellationToken)
        => await context.AssetPrices
            .Where(t => symbols.Contains(t.Symbol))
            .ToDictionaryAsync(t => t.Symbol!, cancellationToken);
}
```

Now that we have a **DataLoader** to fetch the `AssetPrice`, let's introduce the price field to our `Asset`.

We will create a new file called `AssetNode.cs` located in the `Types` directory.

Copy the following code into the file.

```csharp title="/Types/AssetNode.cs"
namespace Demo.Types;

[ExtendObjectType<Asset>]
public static class AssetNode
{
    public static async Task<AssetPrice> GetPriceAsync(
        [Parent] Asset asset,
        AssetPriceBySymbolDataLoader priceBySymbol,
        CancellationToken cancellationToken)
        => await priceBySymbol.LoadAsync(asset.Symbol!, cancellationToken);
}
```

:::note

The `ParentAttributes` marks parameters that represent the runtime value of the declaring GraphQL type. In this case, we are resolving the `price` field of the `Asset` type, so we want to inject the `Asset` instance into our resolver.

:::

The class `AssetNode` is annotated with the `ExtendObjectTypeAttribute`, allowing us to extend an existing type `Asset` with additional fields or overlay existing fields.

```graphql
extend type Asset {
  price: AssetPrice
}
```

As mentioned before the **HotChocolate** source generator will automatically add all annotated types with one of the following attributes to our GraphQL types module.

The `Program.cs` should now look like the following.

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
