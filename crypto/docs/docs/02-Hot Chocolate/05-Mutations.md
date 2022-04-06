# Mutations

In this next chapter, we want to introduce watchlists to our GraphQL schema so that the user can save his favorite crypto assets to a private list stored with his user account.

Everything we have done so far was related to querying data. To enable the new watchlist, we need to mutate data for the first time. At this point, we can ask ourselves: What is a GraphQL Mutation, and how does it differ from a Query?

## Operation Structure

Let's first have a look at the structure of a GraphQL query.

![GraphQL Query Structure](images/query-structure.png)

The initial keyword `query` represents the operation type (root type) on which we want to execute the root selection set.

```graphql
query GetAssets($first: Int) {
  # every thing in here are root selections
}
```

So, when we register the query type in **Hot Chocolate**, we specify the type that represents the `query` operation.

```csharp
builder.Services.AddQueryType<Query>();
```

A mutation is specified almost as a query in the GraphQL syntax.

**DO NOT FORGET TO SWAP IMAGE**
![GraphQL Mutation Structure](images/mutation-structure.png)

The first striking difference is that a mutation starts with the keyword `mutation`. Like with the query type, we need to register a mutation type in **Hot Chocolate**.

```csharp
builder.Services
  .AddQueryType<Query>()
  .AddMutationType<Mutation>();
```

:::note
Only the `query` type is obligatory to have a spec-compliant schema. The `mutation` and `subscription` types are optional.
:::

:::note
By convention, the root types are named `Query`, `Mutation` and `Subscription` in **Hot Chocolate**.

There are other variants in the wild, with some implementations using `QueryRoot`, `MutationRoot`, and `SubscriptionRoot` as their default names.

You are free to pick any name for each operation type.
:::

The second important difference between a query and a mutation is that everything is a query in a query. Every field in a query is side-effect free and, by default, parallel executable.

In a mutation, only fields in the root selection set represent mutations. Mutation fields are executed sequentially since they cause side effects on our system.

```graphql
mutation ModifyWatchlist($input: AddToWatchlistInput!) {
  # everything on this level is a mutation
  addToWatchlist(input: $input) {
    # everything on this level is a query
  }
}
```

Everything within the selection set of a mutation field is essentially the result of the mutation. In general, we want to make the data available to the user that was affected by the mutation.

If we, for instance, would create an object, we might want to resolve the server-generated identifer.

```graphql
mutation CreateBook($input: CreateBookInput!) {
  # everything on this level is a mutation
  createBook(input: $input) {
    # everything on this level is a query
    createdBook {
      id
      title
    }
  }
}
```

:::important
While there is a lot of content out there in the wild suggesting to use nested mutations, as of the GraphQL 2021 specification there are NO nested mutations.

Further, suggestions of using types as namespaces is also not compliant with the GraphQL spec dictated execution behavior and pollutes type system.

> If the operation is a mutation, the result of the operation is the result of executing the operation’s top level selection set on the mutation root object type. This selection set should be executed serially.

https://spec.graphql.org/October2021/#sec-Mutation
https://spec.graphql.org/October2021/#sec-Normal-and-Serial-Execution
:::

## Watchlist Mutations

With the introduction to mutations out of the way lets create our first mutation. In this first try will start with a naive mutation approach.

Create a new file called `WatchlistMutations.cs` located in the `Types/Account` directory and copy the following code.

```csharp title="/Types/Account/WatchlistMutations.cs"
namespace Demo.Types.Account;

[ExtendObjectType(OperationTypeNames.Mutation)]
public sealed class WatchlistMutations
{
    public async Task<Watchlist> AddAssetToWatchlistAsync(
        string symbol,
        [GlobalState] string? username,
        AssetContext context,
        CancellationToken cancellationToken)
    {
        if (username is null)
        {
            throw new GraphQLException("Not Authorized.");
        }

        if (!await context.Assets.AnyAsync(t => t.Symbol == symbol, cancellationToken))
        {
            throw new GraphQLException("Symbol unknown.");
        }

        Watchlist? watchlist = await context.Watchlists.FirstOrDefaultAsync(t => t.User == username, cancellationToken);

        if (watchlist is null)
        {
            watchlist = new Watchlist { User = username };
            context.Watchlists.Add(watchlist);
        }

        watchlist.AddSymbols(symbol);

        await context.SaveChangesAsync(cancellationToken);

        return watchlist;
    }
}
```

Lets have look at the key aspects of this initial mutation. The mutation is called `addAssetToWatchlist` and adds a single `Asset` to the users watchlist by passing in the `symbol`.

We have some initial validation that ensures that we are logged in and that the asset exists.

The mutation will at the end return the `Watchlist` type since this is the entity that we have modified.

The class itself is annotated with the `ExtendObjectTypeAttribute` and extends the mutation type. This allows to have operation type classes per topic which potentially could live in a separate assembly.

Since, we are only extending the `Mutation` type we also need to register a mutation type in our schema that we can extend. For this head over to the `Program.cs` and add `.AddMutationType()` after `.AddQueryType()`.

```csharp
builder.Services
    .AddGraphQLServer()
    .AddQueryType()
    .AddMutationType() // <----
    .AddAssetTypes()
    .AddGlobalObjectIdentification()
    .AddFiltering()
    .AddSorting()
    .AddInMemorySubscriptions()
    .RegisterDbContext<AssetContext>(DbContextKind.Pooled);
```

`AddMutationType` with no generic type or configuration applied to it will create an empty mutation type. This would lead to an error if there were no extension adding at least one field.

Like already explained before our source generator will find the annotated `WatchlistMutations` class and register it with the generated `AddAssetTypes` extension.

Let`s test what we have done before diving deeper.

```bash
dotnet run
```

Open `http://localhost:5000/graphql` and refresh the schema.

![Banana Cake Pop - Refresh Schema](../images/example2-part1-bcp1.png)

Next, lets head over to the `Schema Reference` tab to explore.



## Summary

