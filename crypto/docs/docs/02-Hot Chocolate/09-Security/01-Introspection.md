# Securing Introspection

Introspection is the ability to query the types of a GraphQL schema and with this allows for great tooling, since GraphQL tools can use this capability to allow for IntelliSense or to provide the the data for schema graphs and many, many more things.

In production however the introspection can also be the source of attacks. Either an attacker can use schema introspection to craft large queries that consume a lot of memory and put your server under stress or they use the schema information to try and attack certain aspects of your schema.

It is prudent to not allow introspection queries on production servers or at least limit the people who are allowed to execute introspection requests.

For this exercise head over to `workshops/crypto/backend/playground/example2`.

```bash
code workshops/crypto/backend/playground/example2
```

Hot Chocolate comes with a `Introspection Allowed` validation rule which determines if a request is allowed to execute introspection requests. In order to opt into this rule we need to head over to the `Program.cs` and chain into the GraphQL configuration `AddIntrospectionAllowedRule`.

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
    .AddIntrospectionAllowedRule() // <----
    .AddInMemorySubscriptions()
    .RegisterDbContext<AssetContext>(DbContextKind.Pooled);
```

The completed `Program.cs` should now look like the following:

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
    .AddIntrospectionAllowedRule()
    .AddInMemorySubscriptions()
    .RegisterDbContext<AssetContext>(DbContextKind.Pooled);

var app = builder.Build();

app.UseWebSockets();
app.UseCors(c => c.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
app.UseStaticFiles();
app.MapGraphQL();

app.Run();
```

With this in place our GraphQL server will deny any GraphQL introspection request by default. But we want to allow signed-in users to execute introspection requests in our case.

For this we will implement a `IHttpRequestInterceptor` and define in this interceptor which requests are allowed to execute introspection.

:::note

In order to enrich GraphQL requests you can implement the `IHttpRequestInterceptor` or the `ISocketSessionInterceptor`. The latter is used when GraphQL works over socket protocols.

:::

Hot Chocolate comes with a default implementation of the `IHttpRequestInterceptor` interface which we can use and override the `OnCreateAsync` method to enrich the request. In our concrete example we already have done this and you will find the `CustomHttpRequestInterceptor` in the `Transport` directory.

We want to add after enriching the request with the currently signed in user a small if statement that allows for introspection if we have a user.

```csharp
if (context.User.Identities.Any(t => t.IsAuthenticated))
{
    requestBuilder.AllowIntrospection();
}
```

The completed `CustomHttpRequestInterceptor` should look like the following:

```csharp
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using HotChocolate.AspNetCore;
using HotChocolate.Execution;

namespace Demo.Transport;

public sealed class CustomHttpRequestInterceptor : DefaultHttpRequestInterceptor
{
    private readonly IDbContextFactory<AssetContext> _contextFactory;

    public CustomHttpRequestInterceptor(IDbContextFactory<AssetContext> contextFactory)
    {
        _contextFactory = contextFactory;
    }

    public override async ValueTask OnCreateAsync(
        HttpContext context,
        IRequestExecutor requestExecutor,
        IQueryRequestBuilder requestBuilder,
        CancellationToken cancellationToken)
    {
        requestBuilder.SetGlobalState("username", null);

        if (context.Request.Headers.TryGetValue("Authorization", out var value) && 
            AuthenticationHeaderValue.Parse(value) is { Parameter: { } parameters })
        {
            var credentialBytes = Convert.FromBase64String(parameters);
            var credentials = Encoding.UTF8.GetString(credentialBytes).Split(':', 2);
            string username = credentials[0];

            context.User.AddIdentity(new ClaimsIdentity(new[] { new Claim("sub", credentials[0]) }, "basic"));
            requestBuilder.SetGlobalState("username", credentials[0]);

            await using var assetContext = await _contextFactory.CreateDbContextAsync(cancellationToken);
            if (!await assetContext.Users.AnyAsync(t => t.Name == username, cancellationToken))
            {
                assetContext.Users.Add(new User { Name = username });
                await assetContext.SaveChangesAsync(cancellationToken);
            }
        }

        if (context.User.Identities.Any(t => t.IsAuthenticated))
        {
            requestBuilder.AllowIntrospection();
        }

        await base.OnCreateAsync(context, requestExecutor, requestBuilder, cancellationToken);
    }
}
```

Lets quickly test our new validation rule **Banana Cake Pop**.

Open http://localhost:5000/graphql and create a new tab.

![Banana Cake Pop - New Tab](../images/example8a-bcp1.png)

Switch to the authentication tab and fill in the basic authentication details. Any username and password will work.

![Banana Cake Pop - Authentication Details](../images/example8a-bcp2.png)

Now click **Apply** and execute the following GraphQL query.

```graphql
{
  __schema {
    types {
      name
    }
  }
}
```

The query will execute and we get the list of types in our schema.

![Banana Cake Pop - Operation Result Success](../images/example8a-bcp3.png)

Click on the settings button of the current document, switch to no authentication and click **Apply**.

![Banana Cake Pop - Authentication Details - No Auth Selected](../images/example8a-bcp4.png)

Now execute the same GraphQL query again.

![Banana Cake Pop - Operation Result Success](../images/example8a-bcp5.png)

We will get the following error result:

```json
{
  "errors": [
    {
      "message": "Introspection is not allowed for the current request.",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "extensions": {
        "field": "__schema",
        "code": "HC0046"
      }
    }
  ]
}
```

:::note

The rule will make sure that the fields `__schema` and `__type` are secured but will always allow `__typename` since `__typename` is used by many generated GraphQL clients and only returns a string specifying the type name of an object.

:::

## Summary

In this chapter we have learned why we should secure the GraphQL introspection and how we can do that with Hot Chocolate. We also learned that we can secure the introspection depending on the request and by doing that allowing for instance developers to still use introspection on production servers.

