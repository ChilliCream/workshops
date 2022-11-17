# Request Complexity

Request Complexity is a tool to weigh the request as a whole and measure its impact on the overall system. Essentially we will give each field a cost and validate the potential cost of a request against the maximum allowed cost for requests.

For this exercise head over to `workshops/crypto/backend/playground/example8c`.

```bash
code workshops/crypto/backend/playground/example8c
```

## Introduction

Hot Chocolate will, by default, gives each field a cost of 1. However, if a field uses an async resolver, Hot Chocolate will assume that I/O is involved and that the field has a higher impact. So, for fields with an async resolver, Hot Chocolate will assign a cost of 5. Lastly, Hot Chocolate has a complexity calculation function that will take into account things we call a multiplier. A multiplier can be a field argument that changes the cost of the field or a default behavior of a field, like, for instance, the default page size of a list. Using the field `assets`, for example, without any argument specified, we get a maximum of 10 items back since the default page size is 10. So the cost of all the child fields and the asset field itself is multiplied by the maximum expected items of the asset field.

## Estimating Complexity

Let's say we have a typical GraphQL request like the one below:

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

What impact would that request have on our system?

Let's try it out by enabling request complexity analysis.

First, head over to the `Program.cs` and change the request options to enable request complexity analysis and set the allowed complexity to 100. The number 100 has no real meaning to us yet, but from the general idea, it should be a very low request complexity.

For now, let's run with that and reconfigure the server to enable the complexity analyzer with a max allowed complexity of 100.

````csharp
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
    .ModifyRequestOptions(o =>
    {
        o.Complexity.Enable = true;
        o.Complexity.MaximumAllowed = 100;
    })
    .AddInMemorySubscriptions()
    .RegisterDbContext<AssetContext>(DbContextKind.Pooled);
```

The completed `Program.cs` should look like the following:

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
    .ModifyRequestOptions(o =>
    {
        o.Complexity.Enable = true;
        o.Complexity.MaximumAllowed = 100;
    })
    .AddInMemorySubscriptions()
    .RegisterDbContext<AssetContext>(DbContextKind.Pooled);

var app = builder.Build();

app.UseWebSockets();
app.UseCors(c => c.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
app.UseStaticFiles();
app.MapGraphQL();

app.Run();
````

Now, let's start our GraphQL server and open `http://localhost:5000/graphql`.

Copy the above GraphQL request into **Banana Cake Pop** and hit execute.

![Banana Cake Pop - Complexity Error](../images/example8a-bcp1.png)

```json
{
  "errors": [
    {
      "message": "The maximum allowed operation complexity was exceeded.",
      "extensions": {
        "complexity": 1030,
        "allowedComplexity": 100,
        "code": "HC0047"
      }
    }
  ]
}
```

The GraphQL server responds with an error that the complexity of this particular request is 1030 and exceeds the maximum allowed request complexity. This error gives us an idea of how much this typical request of ours is weighed against our system.

Let's calculate that by hand and focus on the following part of the request first:

```graphql
history {
  nodes {
    epoch
    price
  }
}
```

The fields `nodes`, `epoch`, and `price` are not async and carry a cost of one each. If we sum that up, we have a cost of 3. Then we have the field `history`, an async resolver that fetches data from a rest endpoint and has a default cost of 5. Since `history` is a list with paging enabled, we, by default, have a page size of 10. We sum up the field cost here and multiply it by 10, which gives us a cost of 80.

If we calculate the rest of the field costs, we will get a total cost of 103 for all fields, including assets. Assets again is a list that has paging enabled, so we will estimate a maximum of 10 items, bringing the complexity to 1030.

Complexity describes two things here, the impact on the system in the sense that we have to do expensive I/O calls as well as the cost of sending a large result to our client, essentially the transport costs.

:::note

If a field has an even higher cost, like our fields that call a REST endpoint, we can always annotate the field with the cost directive and specify the cost manually.

:::

Let's say for our service we only want to allow for a maximum cost of 1000. Since we think that this is based on our Hardware and expected parallel user requests, a prudent choice to start with, the user still can fit in the above request by specifying to fetch fewer items at once.

```graphql
query GetChartData {
  assets(first: 5, order: {price: {change24Hour: DESC}}) {
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

By fetching only five items at once, we are down to a request complexity of `515`.

## Summary

GraphQL request complexity gives us a powerful tool to define a performance budget for requests. This allows us to get predictable execution behavior even when we do not know what requests our users will craft. We even can specify custom costs or customize the complexity calculation function. To fine-tune your request performance budget take some time to measure what the impact of requests are to your system and rather start with a lower max allowed complexity since lowering this number is a breaking change for your users. A good tip is to look at the typical requests that your own developers are doing. Like, with the request depth analysis, the request complexity analysis happens before the request is executed.
