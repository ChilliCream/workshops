# Nodes

So far, we can fetch all assets with pagination activated. This allows us to fetch the assets for lists in our GUI. In this next step, we want to enable the consumer of our API to fetch an asset by its id.

Further, we want to introduce a concept for refetching data from any node in our graph. This allows advanced GraphQL client frameworks to get more information on a node. Facebook, has specified this capability as part of the **Relay Server Specifications**. This particular piece is about the global object identification.

## Fetch single Asset

Let's first start with fetching a single node, in this case we want to be able to fetch the `Asset`  by it's `id`. Fetching something by it's key can be efficiently done by a **DataLoader** as we learned in the previous chapter.

We also outlined that it's great to colocate the **DataLoader** code with the GraphQL type it is concerning.

Let's head over to the `AssetNode` and add a new **DataLoader** method to fetch it in a batch by it's `id`.

```csharp
[DataLoader]
internal static async Task<IReadOnlyDictionary<int, Asset>> GetAssetByIdAsync(
    IReadOnlyList<int> ids,
    AssetContext context,
    CancellationToken cancellationToken)
    => await context.Assets
        .Where(t => ids.Contains(t.Id))
        .ToDictionaryAsync(t => t.Id!, cancellationToken);
```

The updated `AssetNode` should look like the following:

```csharp title="/DataLoader/AssetByIdDataLoader.cs"
namespace Demo.Types;

[ExtendObjectType<Asset>]
public static class AssetNode
{
    public static async Task<AssetPrice> GetPriceAsync(
        [Parent] Asset asset,
        AssetPriceBySymbolDataLoader priceBySymbol,
        CancellationToken cancellationToken)
        => await priceBySymbol.LoadAsync(asset.Symbol!, cancellationToken);

    [DataLoader]
    internal static async Task<IReadOnlyDictionary<int, Asset>> GetAssetByIdAsync(
        IReadOnlyList<int> ids,
        AssetContext context,
        CancellationToken cancellationToken)
        => await context.Assets
            .Where(t => ids.Contains(t.Id))
            .ToDictionaryAsync(t => t.Id!, cancellationToken);
}
```

Now that we have a DataLoader to fetch the `Asset` entity by its ID, head over to the `Query.cs` file and add a new method called `GetAssetByIdAsync`.

```csharp
public static async Task<Asset?> GetAssetByIdAsync(
    int id,
    AssetByIdDataLoader assetById,
    CancellationToken cancellationToken)
    => await assetById.LoadAsync(id, cancellationToken);
```

:::note

When **Hot Chocolate** infers GraphQL fields, it will apply GraphQL naming conventions to the field name. Generally, the verb `Get` is stripped from the field name. **Hot Chocolate** will also remove the `Async` postfix of the method name for async methods. Further, the GraphQL naming convention is to have `camelCase` for field names and `PascalCase` for type names. Enum values are written in all `ALL_CAPS_SNAIL_CASE`. You can change the naming behavior by either specifying the name explicitly or overwriting the naming conventions.

:::

The `Query` type should now look like the following:

```csharp title="/Query.cs"
namespace Demo.Types;

[QueryType]
public static class Query
{
    [UsePaging]
    public static IQueryable<Asset> GetAssets(AssetContext context)
        => context.Assets.OrderBy(t => t.Symbol);

    public static async Task<Asset?> GetAssetByIdAsync(
        int id,
        AssetByIdDataLoader assetById,
        CancellationToken cancellationToken)
        => await assetById.LoadAsync(id, cancellationToken);
}
```

Let's test this new resolver.

```bash
dotnet run
```

Open `http://localhost:5000/graphql` and refresh the schema.

![Banana Cake Pop - Refresh Schema](../images/example2-part1-bcp1.png)

Execute the following query.

```graphql
query {
  assetById(id: 1) {
    name
  }
}
```

## Global Object Identification

With the new resolver in place, we can fetch a single `Asset` by its identifier. This is good for us human beings but not so easy to use for GraphQL tools and GraphQL clients. For tools or clients, we need something more generic. The relay team introduced the `Global Object Identification` specification for this purpose.

:::info

The Global Object Identification specification can be found here: https://relay.dev/docs/guides/graphql-server-specification/#object-identification

:::

The specification defines an interface called `Node` that contains a single field called `id` which must be of the type `ID`. The `ID` scalar serializes to `String` or `Int` and represents an identifier. The `id` field of a `Node` must return a schema-unique identifier and allow the server to resolve the `Node` by only the identifier. The identifier by default is serialized as a base64 string containing the GraphQL type name and the identifier.

To opt in to the `Global Object Identification` specification, we need to change the GraphQL server configuration. For this, head over to the `Program.cs`.

```csharp
builder.Services
    .AddGraphQLServer()
    .AddTypes()
    .AddGlobalObjectIdentification()
    .RegisterDbContext<AssetContext>();
```

The `Program.cs` should now look like the following.

```csharp title="/Program.cs"
var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddHttpContextAccessor()
    .AddCors()
    .AddHelperServices();

builder.Services
    .AddDbContextPool<AssetContext>(o => o.UseSqlite("Data Source=assets.db"));

builder.Services
    .AddGraphQLServer()
    .AddTypes()
    .AddGlobalObjectIdentification()
    .RegisterDbContext<AssetContext>();

var app = builder.Build();

app.UseCors(c => c.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
app.UseStaticFiles();
app.MapGraphQL();

app.Run();
```

Now that we have enabled support for the specification, we need to implement the node interface with the `Asset` entity. We do not want to change the `Asset` class itself. We already introduced the object type extension `AssetNode` in the last part of this chapter.

What we essentially want to do in this part is the following.

```graphql
extend type Asset implements Node {
  id: ID!
}
```

For this, we will annotate the `AssetNode` class located in the `Types` directory with the `NodeAttribute`.

```csharp
[Node]
[ExtendObjectType<Asset>]
public static class AssetNode
```

Next, we need to introduce a node resolver, which can resolve the entity by its identifier.

```csharp
[NodeResolver]
public static async Task<Asset> GetByIdAsync(
    int id,
    AssetByIdDataLoader assetById,
    CancellationToken cancellationToken)
    => await assetById.LoadAsync(id, cancellationToken);
```

The updated `AssetNode` class should look like the following.

```csharp title="/Types/AssetNode.cs"
namespace Demo.Types;

[Node]
[ExtendObjectType<Asset>]
public static class AssetNode
{
    public static async Task<AssetPrice> GetPriceAsync(
        [Parent] Asset asset,
        AssetPriceBySymbolDataLoader priceBySymbol,
        CancellationToken cancellationToken)
        => await priceBySymbol.LoadAsync(asset.Symbol!, cancellationToken);

    [DataLoader]
    internal static async Task<IReadOnlyDictionary<int, Asset>> GetAssetByIdAsync(
        IReadOnlyList<int> ids,
        AssetContext context,
        CancellationToken cancellationToken)
        => await context.Assets
            .Where(t => ids.Contains(t.Id))
            .ToDictionaryAsync(t => t.Id!, cancellationToken);

    [NodeResolver]
    public static async Task<Asset> GetByIdAsync(
        int id,
        AssetByIdDataLoader assetById,
        CancellationToken cancellationToken)
        => await assetById.LoadAsync(id, cancellationToken);
}
```

With this in place, let's explore the schema a bit and explore how this changed the execution behavior.

```bash
dotnet run
```

Open `http://localhost:5000/graphql` and refresh the schema.

![Banana Cake Pop - Refresh Schema](../images/example2-part1-bcp1.png)

Now select the `Schema Reference` tab to explore the schema.

![Banana Cake Pop - Refresh Schema](../images/example2-part1-bcp3.png)

We now have two new fields on the `Query` type called `node` and `nodes`. These fields allow us to fetch any node just by its identifier.

Let us fetch an `Asset` first to get the newly encoded identifier.

```graphql
query {
  assetById(id: 1) {
    id
  }
}
```

```json
{
  "data": {
    "assetById": {
      "id": "QXNzZXQKaTE="
    }
  }
}
```

With the identifier we can now call the `node` field like the following:

```graphql
query {
  node(id: "QXNzZXQKaTE=") {
    id
    __typename
  }
}
```

```json
{
  "data": {
    "node": {
      "id": "QXNzZXQKaTE=",
      "__typename": "Asset"
    }
  }
}
```

The node interface itself only exposes the `id` field, and we can additionally ask for the actual type with the `__typename`.

To query the other fields of the `Asset`, we need to use a **Fragment** or an **InlineFragment**. For this example, we will use an **InlineFragment**.

```graphql
query {
  node(id: "QXNzZXQKaTE=") {
    id
    __typename
    ... on Asset {
      symbol
      price {
        lastPrice
      }
    }
  }
}
```

You could compare the **InlineFragment** to an is check in C#.

```csharp
if(node is Asset asset)
{
    Console.WriteLine(asset.Symbol);
}
```

Essentially it will return the fields within the inline fragment if the returned type is an `Asset`.

At this point you might ask yourself why we essentially duplicated the `GetAssetByIdAsync` resolver that we have already on our `Query` type. And you are right to ask this question. Now that you understand the parts of the specification let's remove the boilerplate and infer the node and node resolver.

For this remove the `NodeAttribute` from `AssetNode` and also delete the `NodeResolver`.

```csharp title="/Types/AssetNode.cs"
namespace Demo.Types;

[ExtendObjectType<Asset>]
public static class AssetNode
{
    public static async Task<AssetPrice> GetPriceAsync(
        [Parent] Asset asset,
        AssetPriceBySymbolDataLoader priceBySymbol,
        CancellationToken cancellationToken)
        => await priceBySymbol.LoadAsync(asset.Symbol!, cancellationToken);

    [DataLoader]
    internal static async Task<IReadOnlyDictionary<int, Asset>> GetAssetByIdAsync(
        IReadOnlyList<int> ids,
        AssetContext context,
        CancellationToken cancellationToken)
        => await context.Assets
            .Where(t => ids.Contains(t.Id))
            .ToDictionaryAsync(t => t.Id!, cancellationToken);
}
```

Now, head over to the `Query` class and add the `NodeResolverAttribute` to the `GetAssetByIdAsync` resolver. By doing this we tell Hot Chocolate that this resolver can be used as a node resolver for `Asset` this Hot Chocolate can infer from this that `Asset` must be a node and also that the argument `id` must be of the `ID` type.

```csharp title="/Types/Query.cs"
namespace Demo.Types;

[QueryType]
public static class Query
{
    [UsePaging]
    public static IQueryable<Asset> GetAssets(AssetContext context)
        => context.Assets.OrderBy(t => t.Symbol);

    [NodeResolver]
    public static async Task<Asset?> GetAssetByIdAsync(
        int id,
        AssetByIdDataLoader assetById,
        CancellationToken cancellationToken)
        => await assetById.LoadAsync(id, cancellationToken);
}
```

:::note

if we did not simplify our resolvers here we would also need to add the `IDAttribute` to our `GetAssetByIdAsync` resolver on the `Query` class like the following. This is now also inferred by doing the above.

```csharp title="/Types/Query.cs"
namespace Demo.Types;

[QueryType]
public static class Query
{
    [UsePaging]
    public static IQueryable<Asset> GetAssets(AssetContext context)
        => context.Assets.OrderBy(t => t.Symbol);

    public static async Task<Asset?> GetAssetByIdAsync(
        [ID(nameof(Asset))] int id,
        AssetByIdDataLoader assetById,
        CancellationToken cancellationToken)
        => await assetById.LoadAsync(id, cancellationToken);
}
```

The `nameof(Asset)` argument in the attribute will ensure that only IDs are accepted that are encoded to be `Asset` ids.

:::

## Wrapping Things Up

To complete our schema, we will also make the `AssetPrice` entity a `Node`. In general, not every object type has to be a node. But for parts of the graph that we need to be refetchable, we need to implement the node interface.

In general, nodes should be fetchable through a human usable resolver like we did with asset. But sometimes we merely want the capability to refetch information for node without it making sense for humans to fetch this object by it's id.

This is the case with `AssetPrice` which we want to be a node but humans will always fetch it as a part of the `Asset`.

First we need to tidy up a bit.

Create a new file called `Types/AssetPriceNode.cs`

```csharp title="Types/AssetPriceNode.cs"
namespace Demo.Types;

[ExtendObjectType<AssetPrice>]
public static class AssetPriceNode
{

}
```

Now move over the DataLoader that we created earlier and remove the `DataLoaders.cs`.

```csharp title="Types/AssetPriceNode.cs"
namespace Demo.Types;

[ExtendObjectType<AssetPrice>]
public static class AssetPriceNode
{
    [DataLoader]
    internal static async Task<IReadOnlyDictionary<string, AssetPrice>> GetAssetPriceBySymbolAsync(
        IReadOnlyList<string> keys,
        AssetContext context,
        CancellationToken cancellationToken)
        => await context.AssetPrices
            .Where(t => keys.Contains(t.Symbol))
            .ToDictionaryAsync(t => t.Symbol!, cancellationToken);
}
```

With this in place let's create a new DataLoader to fetch the `AssetPrice` by it's `id` for our node resolver.

```csharp
[DataLoader]
internal static async Task<IReadOnlyDictionary<int, AssetPrice>> GetAssetPriceByIdAsync(
    IReadOnlyList<int> ids,
    AssetContext context,
    CancellationToken cancellationToken)
    => await context.AssetPrices
        .Where(t => ids.Contains(t.Id))
        .ToDictionaryAsync(t => t.Id, cancellationToken);
```

Your `AssetPriceNode` class should now look like the following:

```csharp title="Types/AssetPriceNode.cs"
namespace Demo.Types;

[ExtendObjectType<AssetPrice>]
public static class AssetPriceNode
{
    [DataLoader]
    internal static async Task<IReadOnlyDictionary<string, AssetPrice>> GetAssetPriceBySymbolAsync(
        IReadOnlyList<string> symbols,
        AssetContext context,
        CancellationToken cancellationToken)
        => await context.AssetPrices
            .Where(t => symbols.Contains(t.Symbol))
            .ToDictionaryAsync(t => t.Symbol!, cancellationToken);

    [DataLoader]
    internal static async Task<IReadOnlyDictionary<int, AssetPrice>> GetAssetPriceByIdAsync(
        IReadOnlyList<int> ids,
        AssetContext context,
        CancellationToken cancellationToken)
        => await context.AssetPrices
            .Where(t => ids.Contains(t.Id))
            .ToDictionaryAsync(t => t.Id, cancellationToken);
}
```

With our `DataLoader` in place, we can finally add the finishing touches to our `AssetPriceNode`. Add the `NodeAttribute` and create a node resolver.

```csharp title="/Types/AssetPriceNode.cs"
namespace Demo.Types;

[Node]
[ExtendObjectType<AssetPrice>]
public static class AssetPriceNode
{
    [DataLoader]
    internal static async Task<IReadOnlyDictionary<string, AssetPrice>> GetAssetPriceBySymbolAsync(
        IReadOnlyList<string> symbols,
        AssetContext context,
        CancellationToken cancellationToken)
        => await context.AssetPrices
            .Where(t => symbols.Contains(t.Symbol))
            .ToDictionaryAsync(t => t.Symbol!, cancellationToken);

    [DataLoader]
    internal static async Task<IReadOnlyDictionary<int, AssetPrice>> GetAssetPriceByIdAsync(
        IReadOnlyList<int> ids,
        AssetContext context,
        CancellationToken cancellationToken)
        => await context.AssetPrices
            .Where(t => ids.Contains(t.Id))
            .ToDictionaryAsync(t => t.Id, cancellationToken);

    [NodeResolver]
    public static async Task<AssetPrice> GetAssetPriceByIdAsync(
        int id,
        AssetPriceByIdDataLoader assetPriceById,
        CancellationToken cancellationToken)
        => await assetPriceById.LoadAsync(id, cancellationToken);
}
```

With the addition of the `AssetPriceNode` class, we have made the `AssetPrice` type a node and thus refetchable. Unlike `Asset`, `AssetPrice` has no public `by id` field.

This allows us to refetch the `AssetPrice` and the `Asset` simultaneously from and from both angles.

```graphql
query {
  node(id: "QXNzZXRQcmljZQppODk=") {
    ... on AssetPrice {
      lastPrice
      asset {
        name
      }
    }
  }
}
```

```graphql
query {
  node(id: "QXNzZXQKaTE=") {
    ... on Asset {
      name
      price {
        lastPrice
      }
    }
  }
}
```

## Summary

In this part of the chapter, we introduced the **Global Object Identification** specification to our schema, allowing GraphQL tools and GraphQL clients to refetch parts of the schema through a generic field called `node` by only providing the identifier.
