# Real-Time Data

So far we have looked at several concepts for GraphQL queries and mutations. If we put this in a REST context we essentially dealt with the `GET`, `PUT`, `POST`, `PATCH`, `DELETE` verbs. Everything related to reading data and altering data.

| Operation | GraphQL      | REST                     |
|-----------|--------------|--------------------------|
| Read      | Query        | GET                      |
| Write     | Mutation     | PUT, POST, PATCH, DELETE |

In this chapter, we will learn how to bring realtime functionality into the coin by portal implementing GraphQL subscriptions. The goal is to implement two subscriptions to be exposed by our GraphQL server:

- Send real-time price updates to our app when the price has been updated
- Send real-time notifications whenever a user configured price alert has been hit.

## What are GraphQL subscriptions?

Subscriptions are a GraphQL feature that allows a server to send data to its clients when a specific event happens. Subscriptions are usually implemented with WebSockets but can also be transported by other means like server side events, MQTT, ZeroMQ or Post to a webhook callback . With WebSockets the server maintains a steady connection to its subscribed client. This also breaks the “Request-Response-Cycle” that were used for all previous interactions with the API.

Instead, the client initially opens up a long-lived connection to the server by sending a subscription query that specifies which event it is interested in. Every time this particular event happens, the server uses the connection to push the event data to the subscribed client.

## Price Updates


The first use case we want to solve is to introduce a real-time price update. Essentially we want to give our portal the ability to subscribe to an `onPriceChange` event and update prices shown in the various components in real-time.


## Problems 

- Multiple Subscriptions -> Multiplexing
- Scaling
- Throttling -> batching
- Quality of Service






 
- price updates
- notifications


In the previous part of this chapter we integrated historic data to enable complex price charts. In this part we want to go in the opposite direction by tapping into real-time price information that are coming from an external service.


```csharp
builder.Services
    .AddGraphQLServer()
    .AddQueryType()
    .AddAssetTypes()
    .AddGlobalObjectIdentification()
    .AddFiltering()
    .AddSorting()
    .AddInMemorySubscriptions()
    .RegisterDbContext<AssetContext>(DbContextKind.Pooled);
```

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddHttpContextAccessor()
    .AddCors()
    .AddHelperServices();

builder.Services
    .AddPooledDbContextFactory<AssetContext>(o => o.UseSqlite("Data Source=assets.db"));

builder.Services
    .AddHttpClient(Constants.PriceInfoService, c => c.BaseAddress = new("https://ccc-workshop-eu-functions.azurewebsites.net"));

builder.Services
    .AddGraphQLServer()
    .AddQueryType()
    .AddAssetTypes()
    .AddGlobalObjectIdentification()
    .AddFiltering()
    .AddSorting()
    .AddInMemorySubscriptions()
    .RegisterDbContext<AssetContext>(DbContextKind.Pooled);

var app = builder.Build();

app.UseWebSockets();
app.UseCors(c => c.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
app.UseStaticFiles();
app.MapGraphQL();

app.Run();
```

```csharp
using System.Runtime.CompilerServices;
using HotChocolate.Execution;
using HotChocolate.Subscriptions;

namespace Demo.Types.Assets;

[ExtendObjectType(OperationTypeNames.Subscription)]
public sealed class AssetSubscriptions
{
    [Subscribe]
    [Topic(Constants.OnPriceChange)]
    public async Task<AssetPrice> OnPriceChangeAsync(
        string[]? symbols,
        AssetPriceBySymbolDataLoader assetPriceBySymbol,
        [EventMessage] string symbol,
        CancellationToken cancellationToken)
        => await assetPriceBySymbol.LoadAsync(symbol, cancellationToken);
}
```

```csharp
using System.Runtime.CompilerServices;
using HotChocolate.Execution;
using HotChocolate.Subscriptions;

namespace Demo.Types.Assets;

[ExtendObjectType(OperationTypeNames.Subscription)]
public sealed class AssetSubscriptions
{
    public async IAsyncEnumerable<string> PriceChangeStreamAsync(
        string[]? symbols,
        [Service] ITopicEventReceiver receiver,
        [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        symbols ??= Array.Empty<string>();
        var symbolSet = new HashSet<string>(symbols);
        ISourceStream stream = await receiver.SubscribeAsync<string, string>(Constants.OnPriceChange, cancellationToken);

        await foreach (string symbol in stream.ReadEventsAsync().WithCancellation(cancellationToken))
        {
            if (symbols.Length == 0 || symbolSet.Contains(symbol))
            {
                yield return symbol;
            }
        }
    }

    [Subscribe(With = nameof(PriceChangeStreamAsync))]
    [Topic(Constants.OnPriceChange)]
    public async Task<AssetPrice> OnPriceChangeAsync(
        string[]? symbols,
        AssetPriceBySymbolDataLoader assetPriceBySymbol,
        [EventMessage] string symbol,
        CancellationToken cancellationToken)
        => await assetPriceBySymbol.LoadAsync(symbol, cancellationToken);
}
```

```graphql
subscription OnPriceChange {
  onPriceChange(symbols: ["BTC", "ADA", "ETC", "LTC"]) {
    lastPrice
    change24Hour
    change(span: DAY) {
      percentageChange
      history(first: 2) {
        nodes {
          epoch
          price
        }
      }
    }
    asset {
      symbol
      slug
    }
  }
}
```
