# Lists

In this chapter, we will start with our crypto coin portal example. We will begin with a basic GraphQL server that exposes an `Asset` and an `AssetPrice` type to allow the GraphQL portal to fetch the available crypto assets and price information.

During this chapter, we will cover the following topics:

- Exposing lists of entities from a database
- Cursor pagination
- Global Object Identification
- DataLoader

## Preparations

Before we can begin, we need to clone the workshop repository. To do this, open a terminal on your system. Go to a location on your system where you want to store the repository.

```bash
git clone https://github.com/ChilliCream/workshops.git
```

Next, open the backend playground directory for this example.

```bash
code workshops/crypto/backend/playground/example2
```

Our example server is a relatively empty project with GraphQL not being fully configured yet. We essentially have some basics setup.

A directory called **Helper** holds some services out of scope for this exercise. It is essentially all the stuff that we need to make this exercise work, but you do not need to care about it. One of the helpers we have put in here will seed your local database with data.

Further, we have a directory **Data** containing an Entity Framework `DbContext` with two entities called `Asset` and `AssetPrice`:

* `Asset` contains the base information about a crypto asset, like the name or the icon of a crypto coin.

* `AssetPrice` contains price information like the latest price or the 24-hour high point.

## Asset List

First, we want to expose  a simple list of assets through GraphQL. We will add a new `Query` class with a resolver to fetch the asset list.

:::note

The `Query` class will represent the GraphQL root type for query operations. Query operations in GraphQL represent side-effect-free read operations.

:::

Open your terminal within Visual Studio Code and create a new directory `Types` in the `example2` directory. The `Types` directory will be the home of our GraphQL types.

```bash
mkdir Types
```

Next, create the a `Query.cs` file in the `Types` directory. Copy the following code into the new file.

```csharp title="/Types/Query.cs"
namespace Demo.Types;

public class Query
{
    public IQueryable<Asset> GetAssets(AssetContext context)
        => context.Assets.OrderBy(t => t.Symbol);
}
```

The `GetAssets` method within the `Query` class represents a resolver for the GraphQL root field `assets` on the `Query` type. The GraphQL representation looks like this:

```graphql
type Query {
    assets : [Asset!]!
}
```

:::note
<<<<<<< HEAD
=======

We applied GraphQL naming conventions to the method name `GetAssets` which removed the `Get` verb from the name and applied **camelCase** to it.

:::

To fetch the assets from our database, we need an `AssetContext`. With **Hot Chocolate**, we can ask for services required in our resolver by adding them as parameters. We call this resolver-level dependency injection.
>>>>>>> main

The exclamation mark `!` has a special meaning in GraphQL. All types in GraphQL are nullable by default. The `!` marks a type as `Non-Null` type. Somewhat the opposite of a C# `?`. So the above `assets` property will not be null and will not contain null objects. 

:::

To fetch the assets with `Entity Framework` from our database, we need an `AssetContext`. With **Hot Chocolate**, we can ask for services required in our resolver by adding them as parameters to the resolver method. We call this resolver-level dependency injection. For this to work the GraphQL server needs to know about such services. We will see that in a moment in the next chapter.

In GraphQL, it has benefits to use resolver-level dependency injection since we only will create resources for services we need. Further, the execution engine can resolve those service dependencies for us, allowing it to consider service characteristics like pooled resources or single-threaded services.

:::note

By default, the execution engine will try to execute resolvers in parallel when executing queries. See: https://spec.graphql.org/October2021/#sec-Normal-and-Serial-Execution

:::

## Configuration

Now that we have added our `Query` root type, we need to register it with our GraphQL configuration. Head over to the `Program.cs` where all our service configuration is located.

In this example, the execution engine will rent a pooled `DbContext` and return it after the resolver completes its work.

Now, register the `Query` root type with the GraphQL configuration.

```csharp
builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>();
```

The completed `Program.cs` should look like the following after you have added `AddQueryType<Query>()`.

```csharp title="/Program.cs"
using Demo.Types;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddHttpContextAccessor()
    .AddCors()
    .AddHelperServices();

builder.Services
    .AddPooledDbContextFactory<AssetContext>(o => o.UseSqlite("Data Source=assets.db"));

builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>();

var app = builder.Build();

app.UseCors(c => c.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
app.UseStaticFiles();
app.MapGraphQL();

app.Run();
```

Last but not least, we need to register the `AssetContext` with the GraphQL configuration so that the execution engine understands that `AssetContext` is a pooled `DbContext`. For this chain in the following line with the GraphQL configuration.

```csharp
builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .RegisterDbContext<AssetContext>(DbContextKind.Pooled);
```

The `Program.cs` should now look like the following.

```csharp title="/Program.cs"
using Demo.Types;

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
    .RegisterDbContext<AssetContext>(DbContextKind.Pooled);

var app = builder.Build();

app.UseCors(c => c.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
app.UseStaticFiles();
app.MapGraphQL();

app.Run();
```

Before we can move ahead, let us test our new resolver.

```bash
dotnet run
```

Open `http://localhost:5000/graphql`. Reload the schema to ensure that Banana Cake Pop has the latest version of our schema in memory.

![Banana Cake Pop - Refresh Schema](../images/example2-part1-bcp1.png)

Now, execute the following GraphQL query.

```graphql
query GetAllAssets {
  assets {
    name
  }
}
```

**remark: Maybe add the expected result here as screen shot**
## Summary

<<<<<<< HEAD
In the first part, we have learned how to expose a list of database entities through GraphQL. We also explored resolver dependency injection and registered the `DbContext` with the execution engine.
=======
In the first part, we have learned how to expose a list of database entities through GraphQL. We also explored resolver dependency injection and how we can register the `DbContext` with the execution engine.
>>>>>>> main
