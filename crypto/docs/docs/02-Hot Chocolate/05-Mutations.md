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

## Exercise

With the introduction to mutations out of the way lets create our first mutation.



## Summary

