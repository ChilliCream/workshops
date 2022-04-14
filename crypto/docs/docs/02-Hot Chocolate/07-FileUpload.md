# File Upload

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
    .AddInMemorySubscriptions()
    .RegisterDbContext<AssetContext>(DbContextKind.Pooled);
```

UpdateUserProfileInput

```csharp
namespace Demo.Types.Account;

public record UpdateUserProfileInput(Optional<string?> DisplayName, Optional<IFile?> Image);
```


UserMutations

```csharp
using Demo.Types.Errors;

namespace Demo.Types.Account;

[ExtendObjectType(OperationTypeNames.Mutation)]
public sealed class UserMutations
{

}
```


```csharp
private static async Task<string?> TryStoreImage(
    IFile image,
    IFileStorage storage,
    CancellationToken cancellationToken)
{
    await using Stream iconStream = image.OpenReadStream();
    return await storage.UploadAsync(iconStream, cancellationToken);
}
```

```csharp
[UseMutationConvention(PayloadFieldName = "updatedUser")]
public async Task<User?> UpdateUserProfile(
    [GlobalState] string username,
    UpdateUserProfileInput input,
    IFileStorage storage,
    AssetContext context,
    CancellationToken cancellationToken)
{
    if (username is null)
    {
        throw new NotAuthenticatedException("User Profile");
    }

    User user = await context.Users.FirstAsync(t => t.Name == username, cancellationToken);

    if (input.DisplayName.HasValue)
    {
        user.DisplayName = input.DisplayName.Value;
    }

    if (input.Image.HasValue)
    {
        user.ImageKey = input.Image.Value is null ? null : await TryStoreImage(input.Image.Value, storage, cancellationToken);
    }

    await context.SaveChangesAsync(cancellationToken);
    return user;
}
```