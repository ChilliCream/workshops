# Execution Depth

When we look at securing our GraphQL endpoint for production, another tool for doing this is to make sure that we limit the execution depth.

A potential attacker could craft very deep requests to create large responses and cause many downstream requests. For instance, in our example, we have the two entities `Asset` and `AssetPrice` referencing each other.

A user with malicious intent could easily craft a large request by just drilling into this connection forever. If poorly written, it could cause database requests for each connection.

For this exercise head over to `workshops/crypto/backend/playground/example8b`.

```bash
code workshops/crypto/backend/playground/example8b
```

## Preparations

Before we limit our server to a specific execution depth, it's crucial to inspect the GraphQL schema and decide the appropriate execution depth for our model.

Let's say we discovered that the following request is the deepest GraphQL request that actually makes sense since if we wanted to go deeper, we would create circular references in our graph.

```graphql
query GetChartData {
  assets(order: {price: {change24Hour: DESC}}) {
    nodes {
      symbol
      name
      description
      imageUrl
      price {
        lastPrice
        change24Hour
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
}
```

The above request has a depth of 7, but the typical introspection request has a much deeper request structure. In the previous exercise, we learned how to secure our server against introspection requests, and my recommendation here is to skip introspection requests from the execution depth validation.

This means that people that have the right to access introspection queries will avoid the execution depth analysis for introspection fields, but that could be OK since these people might be our developers anyway.

## Implementation

To add the execution depth validation rule specified above we just need to chain in `.AddMaxExecutionDepthRule(7, skipIntrospectionFields: true)` to our GraphQL configuration.

```csharp
builder.Services
    .AddGraphQLServer()
    .AddQueryType()
    .AddMutationType()
    .AddSubscriptionType()
    .AddAssetTypes()
    .AddType<UploadType>()
    .AddGlobalObjectIdentification()
    .AddMutationConventions()
    .AddFiltering()
    .AddSorting()
    .AddMaxExecutionDepthRule(7, skipIntrospectionFields: true) // <----
    .AddInMemorySubscriptions()
    .RegisterDbContext<AssetContext>(DbContextKind.Pooled);
```

The overall `Program.cs` should now look like the following:

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
    .AddMutationType()
    .AddSubscriptionType()
    .AddAssetTypes()
    .AddType<UploadType>()
    .AddGlobalObjectIdentification()
    .AddMutationConventions()
    .AddFiltering()
    .AddSorting()
    .AddMaxExecutionDepthRule(7, skipIntrospectionFields: true)
    .AddInMemorySubscriptions()
    .RegisterDbContext<AssetContext>(DbContextKind.Pooled);

var app = builder.Build();

app.UseWebSockets();
app.UseCors(c => c.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
app.UseStaticFiles();
app.MapGraphQL();

app.Run();
```

## Testing

Let's see if our new configuration works as expected and test our new validation rule with **Banana Cake Pop**.

Open http://localhost:5000/graphql and create a new tab.

![Banana Cake Pop - New Tab](../images/example8a-bcp1.png)

Next, copy the above request into the operation tab and execute it.

The request will execute just fine since we explicitly defined the execution depth to match our request.

Now let's try to create a request that fails. For this, copy the below request and execute it.

```graphql
query GetChartData {
  assets(order: {price: {change24Hour: DESC}}) {
    nodes {
      price {
        asset {
          price {
            asset {
              price {
                asset {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
}
```

This time we get the following error response.

```json
{
  "errors": [
    {
      "message": "The GraphQL document has an execution depth of 9 which exceeds the max allowed execution depth of 7.",
      "locations": [
        {
          "line": 1,
          "column": 1
        }
      ],
      "extensions": {
        "allowedExecutionDepth": 7,
        "detectedExecutionDepth": 9
      }
    }
  ]
}
```

Execution depth validation is done on the syntax tree of a GraphQL request and will not even hit the execution engine. This way, we make sure that we reduce the attack surface and not waste precious execution resources.

## Summary

In this exercise, we learned how we can make sure attackers cannot craft unlimited deep requests and target our server by letting it do costly database calls or trying to create a large response that consumes a lot of memory.
