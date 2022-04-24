# Query Depth

```graphql
query GetChartData{
  assets(order: { price: { change24Hour: DESC} }) {
    nodes{
      symbol
      name
      description
      imageUrl
      price {
        lastPrice
        change24Hour
        day: change(span: DAY) {
          percentageChange
          history {
            nodes {
              epoch
              price
            }
          }
        }
        week: change(span: WEEK) {
          percentageChange
          history {
            nodes {
              epoch
              price
            }
          }
        }
        month: change(span: MONTH) {
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
