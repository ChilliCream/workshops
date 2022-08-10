# Pagination

In the first part, we exposed the `Asset` entity through GraphQL. Fetching the `assets` field would return all of the elements in the table, which would not scale for a real-world application.

With **Hot Chocolate**, we can use the default paging middleware, which will rewrite the queryable to only fetch a segment of the asset table.

<img src="/img/backend/example2-part1-middleware.png" width="300" />

To use the paging middleware, annotate your `GetAssets` resolver with the `UsePagingAttribute`.

```csharp title="/Types/Query.cs"
namespace Demo.Types;

public class Query
{
    [UsePaging]
    public IQueryable<Asset> GetAssets(AssetContext context)
        => context.Assets.OrderBy(t => t.Symbol);
}
```

:::info

If needed, you can specify paging settings on the `UsePagingAttribute` for a specific field, or we can set global defaults on the GraphQL configuration.

```csharp
builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .AddAssetTypes()
    .AddGlobalObjectIdentification()
    .RegisterDbContext<AssetContext>(DbContextKind.Pooled)
    .SetPagingOptions(new PagingOptions
    {
        DefaultPageSize = 5,
        MaxPageSize = 50,
        IncludeTotalCount = true
    });
```

:::

Now restart your server and refetch the schema with Banana Cake Pop.

![Banana Cake Pop - Paging Fields](../images/example2-part1-bcp2.png)

The earlier query we formulated shows errors because the paging middleware has rewritten the type structure.

Let's change the query to the following and execute it.

```graphql
query GetAllAssets {
  assets {
    nodes {
      name
    }
  }
}
```

We can now define how many items we want to fetch by passing in the `first` argument.

```graphql
query GetAllAssets {
  assets(first: 2) {
    nodes {
      name
    }
  }
}
```

To get information about the current page can fetch the `PageInfo`.

```graphql
query GetAllAssets {
  assets(first: 2) {
    nodes {
      name
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
```

Further, to navigate between pages, we need to use the cursors of the exposed edges. For convenience, we can get the cursor of the first and last element in our list through the `PageInfo`.

```graphql
query GetAllAssets {
  assets(first: 2) {
    nodes {
      name
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

In our dataset, we can pass the `endCurser` to the after argument of our `assets` field to move forward.

```graphql
query GetAllAssets {
  assets(first: 2, after: "MA==") {
    nodes {
      name
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

:::note

A curser defines the position of an element within a dataset. The position is usually not represented by an index but by an id, allowing one to pinpoint a specific object within the dataset.

:::

## Summary

In the second part, we have learned how to expose a list of database entities through GraphQL. We also explore resolver dependency injection and how to register the `DbContext` with the execution engine. Further, we dabbled our feet in cursor-based pagination.
