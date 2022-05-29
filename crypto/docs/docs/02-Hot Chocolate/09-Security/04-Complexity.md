# Query Complexity

In the previous exercises we have learned how we can 

For this exercise head over to `workshops/crypto/backend/playground/example8c`.

```bash
code workshops/crypto/backend/playground/example8c
```


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
    .ModifyRequestOptions(o =>
    {
        o.Complexity.Enable = true;
        o.Complexity.MaximumAllowed = 10;
    })
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
    .ModifyRequestOptions(o =>
    {
        o.Complexity.Enable = true;
        o.Complexity.MaximumAllowed = 10;
    })
    .AddInMemorySubscriptions()
    .RegisterDbContext<AssetContext>(DbContextKind.Pooled);

var app = builder.Build();

app.UseWebSockets();
app.UseCors(c => c.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
app.UseStaticFiles();
app.MapGraphQL();

app.Run();
```