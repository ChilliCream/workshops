# REST Endpoints

Until now we have provided data for the ticker component of our GUI. Further, we have made use of the same data to create some asset list components to show the daily losers and gainers. In the following chapter we will focus on historical data and real-time updates.

During this chapter, we will cover the following topics:

- Integrating existing infrastructure like REST services
- Tapping into external systems to yield real-time data

In this first part we will focus on integrating our existing REST services that provide historical price data.

## Infrastructure

Assume that we have two existing services running in Azure. The first of these services aggregates the price change for predefined spans (All, Hour, Day, Week, Month, Year).

Our percentage change service can be invoked by providing a single asset symbol and a span.

```
GET https://ccc-workshop-eu-functions.azurewebsites.net/api/asset/price/change?symbol=BTC&span=Day
```

When invoking this endpoint it will yield the following result:

```json
{"symbol": "BTC", "span": "Day", "percentageChange": 0.013746913132633685}
```

We also have a batch version of this service where we can provide multiple symbols.

```
GET https://ccc-workshop-eu-functions.azurewebsites.net/api/asset/price/change?symbols=ADA,BTC&span=Day
```

This optimized variant will return a list of results:

```json
[
  {"symbol": "ADA", "span": "Day", "percentageChange": 0.07333038478549311},
  {"symbol": "BTC", "span": "Day", "percentageChange": 0.060505252760106244}
]
```

We also have a second rest service running along this one providing historical price point. This service can be invoked like the previous one with a symbol and a span.

```
GET https://ccc-workshop-eu-functions.azurewebsites.net/api/asset/price/history?symbol=ADA&span=Day
```

The service will yield a list of price points for a given span.

```json
{
  "symbol": "ADA",
  "span": "Day",
  "entries": [
    {"epoch": 1648404000, "price": 1.1307},
    {"epoch": 1648404300, "price": 1.1313}
  ]
}
```

Again, like the first service we also have a batch API to invoke it which allows us to fetch multiple price histories at once for a given span.

```
GET https://ccc-workshop-eu-functions.azurewebsites.net/api/asset/price/history?symbols=ADA,BTC&span=Day
```

```json
[
  {
    "symbol": "ADA",
    "span": "Day",
    "entries": [
      {"epoch": 1648404000, "price": 1.1307},
      {"epoch": 1648404300, "price": 1.1313}
    ]
  }
]
```

## Planing ahead

Before we can start integrating these service we need to think about how we want to access this data. Since it is related to the price fetching it through the price would allow us an easy way to get the data.

```graphql
query Asset {
  assetBySymbol(symbol: "BTC") {
    id
    name
    price {
      lastPrice
      change(span: DAY) {
        percentageChange
        history {
          nodes {
            epoch
            price
          }
        }
      }
    }
  }
}
```

Allowing the consumer to access the data in this way would translate to the following GraphQL SDL.

```graphql
type AssetPriceChange implements Node {
  id: ID!
  percentageChange: Float!
  history(
    first: Int
    after: String
    last: Int
    before: String
  ): HistoryConnection
}
}
```

```graphql
type AssetPriceHistory {
  epoch: Int!
  price: Float!
}
```

## Typing external data structures

In order to type external data we could use the GraphQL SDL like the above or the fluent type API. For the next example we will use the fluent API to type the data.

Open the example project for this part.

```
code workshops/crypto/backend/playground/example3-1
```

Create a new file `AssetPriceChangeType.cs` in the `Types/Assets` directory.

```csharp title="/Types/Assets/AssetPriceChangeType.cs"
using System.Text.Json;
using HotChocolate.Resolvers;

namespace Demo.Types.Assets;

public sealed class AssetPriceChangeType : ObjectType
{
    protected override void Configure(IObjectTypeDescriptor descriptor)
    {
        descriptor
            .Name("AssetPriceChange")
            .IsOfType(IsAssetPriceChangeType);

        descriptor
            .Field("percentageChange")
            .Type<NonNullType<FloatType>>()
            .FromJson();
    }

    private static bool IsAssetPriceChangeType(IResolverContext context, object resolverResult)
        => resolverResult is JsonElement element &&
            element.TryGetProperty("percentageChange", out _);
}
```

The above type class defines the `AssetPriceChange` type. We also added a method `IsAssetPriceChangeType` that will check if a JSON structure is of this type. In this example we are checking the structure of the JSON element that represents our `AssetPrice`, if the the objects contains a property `percentageChange` we will assume it to be an `AssetPriceChange` object.

With the type in place we can start with fetching the data. Since we have a batching endpoint that allows us to fetch multiple price changes at once we can uset the batch **DataLoader** for this.

Due to the fact that we have more than one REST service let us introduce a base class to have less duplicated code.

Create a new file `HttpBatchDataLoader` in the `DataLoader` directory and copy the following code into that file.

```csharp title="/DataLoader/HttpBatchDataLoader.cs"
using System.Text.Json;

namespace Demo.DataLoader;

public abstract class HttpBatchDataLoader<TKey>
    : BatchDataLoader<TKey, JsonElement>
    where TKey : notnull
{
    protected HttpBatchDataLoader(
        IHttpClientFactory clientFactory,
        IBatchScheduler batchScheduler,
        DataLoaderOptions? options = null)
        : base(batchScheduler, options)
    {
        ClientFactory = clientFactory ?? throw new ArgumentNullException(nameof(clientFactory));
    }

    public IHttpClientFactory ClientFactory { get; }

    protected sealed override async Task<IReadOnlyDictionary<TKey, JsonElement>> LoadBatchAsync(
        IReadOnlyList<TKey> keys,
        CancellationToken cancellationToken)
    {
        using var client = ClientFactory.CreateClient(Constants.PriceInfoService);
        return await LoadBatchAsync(keys, client, cancellationToken);
    }

    protected abstract Task<IReadOnlyDictionary<TKey, JsonElement>> LoadBatchAsync(
        IReadOnlyList<TKey> keys,
        HttpClient client,
        CancellationToken cancellationToken);
}
```

Our base class will just have some convenience added sp that we do not need to create the actual HTTP client everytime. Moreover, we fixed the result type to a `JsonElement`.

With this in place we need to define the actual **DataLoader**. As we have learned in the previous chapter a **DataLoader** is a very simple utillity that will fetch an entity for a key, but in this case we need to pass along two information to our **DataLoader** which are the `span` and the `symbol`. We could approach this from different angles. One solution would be to have a **DataLoader** per span, but thinking about this already tells us that this would not scale very well. What we will do for our service is to introduce a new struct called `KeyAndSpan` which holds both information and represents our composit key.

Let us first create an enum representing the `span`. For this create a new class called `ChangeSpan` in the `Types/Assets` directory and copy the code below.

```csharp title="/Types/Assets/ChangeSpan.cs"
namespace Demo.Types.Assets;

public enum ChangeSpan
{
    All,
    Hour,
    Day,
    Week,
    Month,
    Year
}
```

Next, we will introduce our `KeyAndSpan` struct. Since we need propper equavilence implemented for our key type we will use a `readonly record struct`. This take away all the complexity of implementing such a key type and reduces it really to one line of code.

Create a file called `KeyAndSpan.cs` in the `Types/Assets` directory and copy the code below.

```csharp title="/Types/Assets/HttpBatchDataLoader.cs"
namespace Demo.Types.Assets;

public readonly record struct KeyAndSpan(string Symbol, ChangeSpan Span);
```

Finally, we have everything in place to create our `AssetPriceChangeDataLoader` which we will add to the `DataLoader` directory.

```csharp title="/DataLoader/AssetPriceChangeDataLoader.cs"
using System.Text.Json;
using Demo.Types.Assets;

namespace Demo.DataLoader;

public sealed class AssetPriceChangeDataLoader : HttpBatchDataLoader<KeyAndSpan>
{
    public AssetPriceChangeDataLoader(
        IHttpClientFactory clientFactory,
        IBatchScheduler batchScheduler,
        DataLoaderOptions? options = null)
        : base(clientFactory, batchScheduler, options)
    {
    }

    protected override async Task<IReadOnlyDictionary<KeyAndSpan, JsonElement>> LoadBatchAsync(
        IReadOnlyList<KeyAndSpan> keys,
        HttpClient client,
        CancellationToken cancellationToken)
    {
        var map = new Dictionary<KeyAndSpan, JsonElement>();

        foreach (var group in keys.GroupBy(t => t.Span))
        {
            string symbols = string.Join(",", group.Select(t => t.Symbol));
            using var request = new HttpRequestMessage(
                HttpMethod.Get,
                $"api/asset/price/change?symbols={symbols}&span={group.Key}");
            using var response = await client.SendAsync(request, cancellationToken);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsByteArrayAsync(cancellationToken);
            var document = JsonDocument.Parse(content);
            var root = document.RootElement;

            foreach (JsonElement priceInfo in root.EnumerateArray())
            {
                string symbol = priceInfo.GetProperty("symbol").GetString()!;
                map.Add(new(symbol, group.Key), priceInfo);
            }
        }

        return map;
    }
}
```

Our `AssetPriceChangeDataLoader` will essentially fetch a batch of price changes from our REST endpoint and then decompose the received JSON list into JSON object that represent the price change objects.

Lets integrate our new type into the existing `AssetPrice`. For this head over to the `AssetPriceNode` class and add the following resolver to it.

```csharp
[GraphQLType(typeof(AssetPriceChangeType))]
public async Task<JsonElement> GetChangeAsync(
    ChangeSpan span,
    [Parent] AssetPrice parent,
    AssetPriceChangeDataLoader assetPriceBySymbol,
    CancellationToken cancellationToken)
{
    return await assetPriceBySymbol.LoadAsync(new KeyAndSpan(parent.Symbol!, span), cancellationToken);
}
```

The above resolver would translate to a field like the following if we expressed it in GraphQL SDL.

```graphql
extend type AssetPrice {
  change(span: ChangeSpan!): AssetPriceChange
}
```

Striking for our resolver is that we just return the `JsonElement` from our resolver. We do not need to deserialize it to a proper .NET type since we annotated the resolver with `[GraphQLType(typeof(AssetPriceChangeType))]`. This tells the execution engine all about the structure of this type.

The completed `AssetPriceNode` file should now look like the following.

```csharp title="/Types/Assets/AssetPriceNode.cs"
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
        [Parent] AssetPrice parent,
        AssetPriceChangeDataLoader assetPriceBySymbol,
        CancellationToken cancellationToken)
    {
        return await assetPriceBySymbol.LoadAsync(new KeyAndSpan(parent.Symbol!, span), cancellationToken);
    }

    [NodeResolver]
    public static Task<AssetPrice> GetByIdAsyncAsync(
        int id,
        AssetPriceByIdDataLoader dataLoader,
        CancellationToken cancellationToken)
        => dataLoader.LoadAsync(id, cancellationToken);
}
```

We have one more step to do before we can try our newly integrated data and that is adding a configured HTTP connection to our server configuration.

Head over to the `Program.cs` and add the following service registration to it.

```csharp
builder.Services
    .AddHttpClient(Constants.PriceInfoService, c => c.BaseAddress = new("https://ccc-workshop-eu-functions.azurewebsites.net"));
```

Now, lets test if we can query the price change.

```bash
dotnet run
```

Open `http://localhost:5000/graphql` and refresh the schema.

![Banana Cake Pop - Refresh Schema](../images/example2-part1-bcp1.png)

Execute the following query to see if we have integrated our service correctly. 

```graphql
query Asset {
  assetBySymbol(symbol: "BTC") {
    id
    name
    price {
      lastPrice
      change(span: DAY) {
        percentageChange
      }
    }
  }
}
```

## Integrating multiple external services

We have successfully integrated the price change. So let us take it up a notch by extending the previously integrated data structure with more external data.

The history data structure itself is actually simpler. We essetially have two fields that are of the type `Int!` and `Float!` and we are done.

```csharp title="/Types/Assets/AssetPriceHistoryType.cs"
namespace Demo.Types.Assets;

public sealed class AssetPriceHistoryType : ObjectType
{
    protected override void Configure(IObjectTypeDescriptor descriptor)
    {
        descriptor
            .Name("AssetPriceHistory");

        descriptor
            .Field("epoch")
            .Type<NonNullType<IntType>>()
            .FromJson();

        descriptor
            .Field("price")
            .Type<NonNullType<FloatType>>()
            .FromJson();
    }
}
```

:::info

As mentioned before, we could also use the GraphQL SDL and schema-first to integrate this type. In this case we would use the `@fromJson` directive to signal to the execution engine that this data is coming from a JSON object.

```graphql
type AssetPriceHistory {
  epoch: Int! @fromJson
  price: Float! @fromJson
}
```

:::

Next, as before we will use a **DataLoader** to fetch the data from the external service.
The **DataLoader** will reuse the `KeyAndSpan` struct as the key type.

Create a new file `AssetPriceHistoryDataLoader.cs` in the `DataLoader` directory and copy the code below.

```csharp title="/DataLoader/AssetPriceHistoryDataLoader.cs"
using System.Text.Json;
using Demo.Types.Assets;

namespace Demo.DataLoader;

public sealed class AssetPriceHistoryDataLoader : HttpBatchDataLoader<KeyAndSpan>
{
    public AssetPriceHistoryDataLoader(
        IHttpClientFactory clientFactory,
        IBatchScheduler batchScheduler,
        DataLoaderOptions? options = null)
        : base(clientFactory, batchScheduler, options)
    {
    }

    protected override async Task<IReadOnlyDictionary<KeyAndSpan, JsonElement>> LoadBatchAsync(
        IReadOnlyList<KeyAndSpan> keys,
        HttpClient client,
        CancellationToken cancellationToken)
    {
        var map = new Dictionary<KeyAndSpan, JsonElement>();

        foreach (var group in keys.GroupBy(t => t.Span))
        {
            string symbols = string.Join(",", group.Select(t => t.Symbol));
            using var request = new HttpRequestMessage(
                HttpMethod.Get,
                $"api/asset/price/history?symbols={symbols}&span={group.Key}");
            using var response = await client.SendAsync(request, cancellationToken);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsByteArrayAsync(cancellationToken);
            var document = JsonDocument.Parse(content);
            var root = document.RootElement;

            foreach (JsonElement priceInfo in root.EnumerateArray())
            {
                string symbol = priceInfo.GetProperty("symbol").GetString()!;
                map.Add(new(symbol, group.Key), priceInfo);
            }
        }

        return map;
    }
}
```

This is the part where things become more tricky. We now need to integrate a new resolver with the `AssetPriceChange` type to fetch the history data. To fetch the history data we need the `ChangeSpan` and `Symbol` to which the histor belongs to. We could preservice this information and store it on the execution context.

:::info

**Hot Chocolate** allows to store three different kinds of execution states in order to customize execution behavior.

- Global Execution State
- Scoped Execut

:::


```csharp
    private class Resolvers
    {
        public async Task<Connection<JsonElement>> GetHistoryAsync(
            [ScopedState] KeyAndSpan keyAndSpan,
            AssetPriceHistoryDataLoader dataLoader,
            IResolverContext context,
            CancellationToken cancellationToken)
        {
            JsonElement history = await dataLoader.LoadAsync(keyAndSpan, cancellationToken);
            return await history.GetProperty("entries").EnumerateArray().ToArray().ApplyCursorPaginationAsync(context, cancellationToken: cancellationToken);
        }
    }
```

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

```csharp
descriptor
    .Field<Resolvers>(t => t.GetHistoryAsync(default, default, default!, default!, default))
    .UsePaging<AssetPriceHistoryType>();
```

```csharp
using System.Text.Json;
using HotChocolate.Resolvers;
using HotChocolate.Types.Pagination;
using HotChocolate.Types.Pagination.Extensions;

namespace Demo.Types.Assets;

public sealed class AssetPriceChangeType : ObjectType
{
    protected override void Configure(IObjectTypeDescriptor descriptor)
    {
        descriptor
            .Name("AssetPriceChange")
            .IsOfType(IsAssetPriceChangeType);

        descriptor
            .Field("id")
            .Type<NonNullType<IdType>>()
            .FromJson(obj =>
            {
                if (obj.TryGetProperty("symbol", out var symbol) &&
                    obj.TryGetProperty("span", out var span))
                {
                    return $"{symbol.GetString()}:{span.GetString()}";
                }

                return null;
            });

        descriptor
            .Field("percentageChange")
            .Type<NonNullType<FloatType>>()
            .FromJson();

        descriptor
            .Field<Resolvers>(t => t.GetHistoryAsync(default, default, default!, default!, default))
            .UsePaging<AssetPriceHistoryType>();
    }

    private static bool IsAssetPriceChangeType(IResolverContext context, object resolverResult)
        => resolverResult is JsonElement element &&
            element.TryGetProperty("percentageChange", out _);

    private class Resolvers
    {
        public async Task<Connection<JsonElement>> GetHistoryAsync(
            [ScopedState] ChangeSpan span,
            [Parent] JsonElement parent,
            AssetPriceHistoryDataLoader dataLoader,
            IResolverContext context,
            CancellationToken cancellationToken)
        {
            string symbol = parent.GetProperty("symbol").GetString()!;
            JsonElement history = await dataLoader.LoadAsync(new KeyAndSpan(symbol, span), cancellationToken);
            return await history.GetProperty("entries").EnumerateArray().ToArray().ApplyCursorPaginationAsync(context, cancellationToken: cancellationToken);
        }
    }
}
```

```csharp
[GraphQLType(typeof(AssetPriceChangeType))]
public async Task<JsonElement> GetChangeAsync(
    ChangeSpan span,
    [ScopedState("span")] SetState<ChangeSpan> setSpan,
    [Parent] AssetPrice parent,
    AssetPriceChangeDataLoader assetPriceBySymbol,
    CancellationToken cancellationToken)
{
    setSpan(span);
    return await assetPriceBySymbol.LoadAsync(new KeyAndSpan(parent.Symbol!, span), cancellationToken);
}
```

```csharp
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
        [ScopedState("span")] SetState<ChangeSpan> setSpan,
        [Parent] AssetPrice parent,
        AssetPriceChangeDataLoader assetPriceBySymbol,
        CancellationToken cancellationToken)
    {
        setSpan(span);
        return await assetPriceBySymbol.LoadAsync(new KeyAndSpan(parent.Symbol!, span), cancellationToken);
    }

    [NodeResolver]
    public static Task<AssetPrice> GetByIdAsyncAsync(
        int id,
        AssetPriceByIdDataLoader dataLoader,
        CancellationToken cancellationToken)
        => dataLoader.LoadAsync(id, cancellationToken);
}
```
