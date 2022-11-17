# Integrating existing infrastructure

Until now, we have provided data for the ticker component of our GUI. Further, we have used the same data to create some asset list components to show the daily losers and gainers. We now want to provide historical price data through our GraphQL server so that we can build a price chart component in our GUI.

The historical price data are available through REST services that represent our existing infrastructure.
In this chapter we will focus on existing REST services with our new GraphQL server to provide historical price data.

## Infrastructure

Assume that we have two existing services running in Azure. The first of these services aggregate the price change for predefined spans (All, Hour, Day, Week, Month, Year).

The price change service can be invoked by providing an asset symbol and a span.

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

We also have a second REST service running along the price change service providing historical price points. We need to provide the asset symbol and the span to fetch historical price points.

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

Again, like the first service, we also have a batch API to invoke it, which allows us to fetch multiple historic price points at once for a given span.

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

## Planning ahead

Before we can start integrating these services, we need to think about how we want to access this data. Since it is related to the price, fetching it through the `AssetPrice` type would allow us to get the data quickly.

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

We could use the GraphQL SDL like the above or the fluent type API to type external data. We chose the fluent API to type the data for the following example.

Open the example project for this part.

```
code workshops/crypto/backend/playground/example3
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

The above type class defines the `AssetPriceChange` type. We also added a method, `IsAssetPriceChangeType`, to check if a JSON structure is this type. In this example, we are checking the structure of the JSON element that represents our `AssetPriceChange`; if the object contains a property `percentageChange`, we will assume it to be an `AssetPriceChange` object.

With the type in place, we can start with fetching the data. Since we have a batching endpoint that allows us to fetch multiple price changes simultaneously, we can use the batch **DataLoader**.

Because we have more than one REST service, let us introduce a base class to have less code duplication.

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

Our base class will just have some convenience added sp that we do not need to create the actual HTTP client every time. Moreover, we fixed the result type to a `JsonElement`.

With this in place, we need to define the actual **DataLoader**. As we have learned in the previous chapter, a **DataLoader** is a straightforward utility that will fetch an entity for a key.

Still, in this case, we need to pass along two pieces of information to our **DataLoader**: the `span` and the `symbol`. We could approach this from different angles. One solution would be to have a **DataLoader** per span, but thinking about this already tells us that this would not scale very well. What we will do for our service is to introduce a new struct called `KeyAndSpan`, which holds both information and represents our composite key.

Let us first create an enum representing the `span`. For this, create a new class called `ChangeSpan` in the `Types/Assets` directory and copy the code below.

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

Next, we will introduce our `KeyAndSpan` struct. Since we need proper equivalence implemented for our key type, we will use a `readonly record struct`. This takes away all the complexity of implementing such a key type and reduces it to one line of code.

Create a `KeyAndSpan.cs` file in the `Types/Assets` directory and copy the code below.

```csharp title="/Types/Assets/HttpBatchDataLoader.cs"
namespace Demo.Types.Assets;

public readonly record struct KeyAndSpan(string Symbol, ChangeSpan Span);
```

Finally, we have everything in place to create our `AssetPriceChangeDataLoader`, which we will add to the `DataLoader` directory.

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

Our `AssetPriceChangeDataLoader` will essentially fetch a batch of price changes from our REST endpoint and then decompose the received JSON list into a JSON object representing the price change objects.

Let's integrate our new type into the existing `AssetPrice`. For this, head over to the `AssetPriceNode` class and add the following resolver to it.

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

We have one more step to do before we can try our newly integrated data, and that is adding a configured HTTP connection to our server configuration.

Head over to the `Program.cs` and add the following service registration.

```csharp
builder.Services
    .AddHttpClient(Constants.PriceInfoService, c => c.BaseAddress = new("https://ccc-workshop-eu-functions.azurewebsites.net"));
```

Now, let's test if we can query the price change.

```bash
dotnet run
```

Open `http://localhost:5000/graphql` and refresh the schema.

![Banana Cake Pop - Refresh Schema](./images/example2-part1-bcp1.png)

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

The history data structure itself is simpler. We essentially have two fields of the type `Int!` and `Float!` and we are done.

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

As mentioned before, we could also use the GraphQL SDL and schema-first to integrate this type. , we would use the `@fromJson` directive to signal to the execution engine that this data is coming from a JSON object.

```graphql
type AssetPriceHistory {
  epoch: Int! @fromJson
  price: Float! @fromJson
}
```

:::

Next, as before, we will use a **DataLoader** to fetch the data from the external service.
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

This is the part where things become more tricky. To fetch the history data, we now need to integrate a new resolver with the `AssetPriceChange` type. To fetch the historical data, we need the `ChangeSpan` and `Symbol` to which the history belongs. We could preserve this information and store it in the execution context.

:::info

**Hot Chocolate** allows storing three different kinds of execution states to customize execution behavior.

- Global Execution State
  The global execution states can be accessed and mutated before the execution begins and after it ends. It can also be accessed and modified by request- and field-middleware and the resolver itself.

- Scoped Execution State
  The scoped execution state can be accessed and modified by the request- and field-middleware and also by the resolver. Modifications to the scoped state are only accessible from the subtree where the change happened.

- Local Execution State
  The local execution state can only be accessed and modified within a field resolver pipeline.

:::

For our problem at hand, we want to push the `keyAndSpan` we create in the `GetChangeAsync` resolver down to our `GetHistoryAsync` we still need to implement. **Hot Chocolate** provides for this a scoped execution state on which we can store data for our subtree.

First, head over to the `AssetPriceNode` class and locate the `GetChangeAsync` resolver. Replace the current implementation with the code below.

```csharp
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
```

We added a new `SetState<KeyAndSpan>` parameter to our resolver, a delegate that allows us to set a `KeyAndSpan` on our scoped execution state. This state will be available to all resolvers in our subtree.

Next, head over to the `AssetPriceChangeType` and add a nested class `Resolvers`. You can copy & paste the code below for this.

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

We can see that our `GetHistoryAsync` resolver injects the `keyAndSpan` parameter from our scoped execution state.

With our resolver in place, we must register a field in our `AssetPriceChangeType`. For this, add the following code into the `Configure` method.

```csharp
descriptor
    .Field<Resolvers>(t => t.GetHistoryAsync(default, default!, default!, default))
    .UsePaging<AssetPriceHistoryType>();
```

The completed `AssetPriceChangeType` should now look like the following.

```csharp title="/Types/Assets/AssetPriceChangeType.cs"
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
            .Field("percentageChange")
            .Type<NonNullType<FloatType>>()
            .FromJson();

        descriptor
            .Field<Resolvers>(t => t.GetHistoryAsync(default, default!, default!, default))
            .UsePaging<AssetPriceHistoryType>();
    }

    private static bool IsAssetPriceChangeType(IResolverContext context, object resolverResult)
        => resolverResult is JsonElement element &&
            element.TryGetProperty("percentageChange", out _);

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
}
```

With this done, we have integrated both services with our GraphQL server and should start our server to test if we have done well.

Also, we are using paging in a custom way by using the `ApplyCursorPaginationAsync` extension method on top of our JSON result object.

![Banana Cake Pop - Refresh Schema](./images/example2-part1-bcp1.png)

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

## Refinements

We have one more requirement from our GUI. Within our GUI component, we want to be able to refetch the price change data separate from our `AssetPrice`.

For this, we need to implement the node interface with the `AssetPriceChange` type.

Let's head over to the `AssetPriceChangeType.cs` file again and change the configuration.

First, we need to introduce a node resolver to our nested `Resolvers` class.

```csharp
public async Task<JsonElement?> ResolveNodeAsync(
    string id,
    [ScopedState("keyAndSpan")] SetState<KeyAndSpan> setKey,
    AssetPriceChangeDataLoader dataLoader,
    CancellationToken cancellationToken)
{
    string[] parts = id.Split(':');
    ChangeSpan span = Enum.Parse<ChangeSpan>(parts[1]);
    var key = new KeyAndSpan(parts[0], span);
    setKey(key);
    return await dataLoader.LoadAsync(key, cancellationToken);
}
```

Next, we need to introduce a new `id` field to the type. The identifier must contain the span and the symbol to correctly resolve the `AssetPriceChange` from the REST service.

For this, we will introduce a new field configuration that aggregates data from our JSON object.

```csharp
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
```

Lastly, we will introduce some type configuration that implements the node interface and binds the node resolver to the type.

```csharp
descriptor
    .ImplementsNode()
    .ResolveNodeWith<Resolvers>(t => t.ResolveNodeAsync(default!, default!, default!, default!));
```

The completed `AssetPriceChangeType` should look like the following.

```csharp title="/Types/Assets/AssetPriceChangeType.cs"
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
            .ImplementsNode()
            .ResolveNodeWith<Resolvers>(t => t.ResolveNodeAsync(default!, default!, default!, default!));

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
            .Field<Resolvers>(t => t.GetHistoryAsync(default, default!, default!, default))
            .UsePaging<AssetPriceHistoryType>();
    }

    private static bool IsAssetPriceChangeType(IResolverContext context, object resolverResult)
        => resolverResult is JsonElement element &&
            element.TryGetProperty("percentageChange", out _);

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

        public async Task<JsonElement?> ResolveNodeAsync(
            string id,
            [ScopedState("keyAndSpan")] SetState<KeyAndSpan> setKey,
            AssetPriceChangeDataLoader dataLoader,
            CancellationToken cancellationToken)
        {
            string[] parts = id.Split(':');
            ChangeSpan span = Enum.Parse<ChangeSpan>(parts[1]);
            var key = new KeyAndSpan(parts[0], span);
            setKey(key);
            return await dataLoader.LoadAsync(key, cancellationToken);
        }
    }
}
```

Let's test our server again.

```bash
dotnet run
```

![Banana Cake Pop - Refresh Schema](./images/example2-part1-bcp1.png)

Execute the following query to see if we have integrated our service correctly.

```graphql
query GrabPriceChangeId {
  assetBySymbol(symbol: "BTC") {
    price {
      change(span: DAY) {
        id
      }
    }
  }
}
```

```graphql
query RefetchData {
  node(id: "QXNzZXRQcmljZUNoYW5nZQpkQlRDOkRheQ==") {
    id
    ... on AssetPriceChange {
      history {
        nodes {
          epoch
        }
      }
    }
  }
}
```

## Summary

In this chapter, we modify our backend to cater to the new use-cases that we face for our price charts, we have learned how to integrate data from different services. When you start with GraphQL, you will not have the luxury to start fresh; often, we have an existing infrastructure. With **HotChocolate**, it is simple to integrate JSON data by just typing it. Whether you prefer to use the GraphQL SDL or the fluent type API is up to you. Further, we have leveraged **DataLoader** to interact with our REST services more efficiently. Last but not least, we introduced refetchability to external data through the node interface.
