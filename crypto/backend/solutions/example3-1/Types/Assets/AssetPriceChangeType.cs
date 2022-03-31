using System.Text.Json;
using HotChocolate.Resolvers;
using HotChocolate.Types.Pagination;
using HotChocolate.Types.Pagination.Extensions;

namespace Demo.Types.Assets;

public sealed class AssetPriceChangeType : ObjectType
{
    protected override void Configure(IObjectTypeDescriptor descriptor)
    {
        descriptor
            .Name("AssetPriceChange")
            .IsOfType(IsAssetPriceChangeType);

        descriptor
            .ImplementsNode()
            .ResolveNodeWith<Resolvers>(t => t.ResolveNodeAsync(default!, default!, default!, default!));

        descriptor
            .Field("id")
            .Type<NonNullType<IdType>>()
            .FromJson(obj =>
            {
                if (obj.TryGetProperty("symbol", out var symbol) &&
                    obj.TryGetProperty("span", out var span))
                {
                    return $"{symbol.GetString()}:{span.GetString()}";
                }

                return null;
            });

        descriptor
            .Field("percentageChange")
            .Type<NonNullType<FloatType>>()
            .FromJson();

        descriptor
            .Field<Resolvers>(t => t.GetHistoryAsync(default, default!, default!, default))
            .UsePaging<AssetPriceHistoryType>();
    }

    private static bool IsAssetPriceChangeType(IResolverContext context, object resolverResult)
        => resolverResult is JsonElement element &&
            element.TryGetProperty("percentageChange", out _);

    private class Resolvers
    {
        public async Task<Connection<JsonElement>> GetHistoryAsync(
            [ScopedState] KeyAndSpan keyAndSpan,
            AssetPriceHistoryDataLoader dataLoader,
            IResolverContext context,
            CancellationToken cancellationToken)
        {
            JsonElement history = await dataLoader.LoadAsync(keyAndSpan, cancellationToken);
            return await history.GetProperty("entries").EnumerateArray().ToArray().ApplyCursorPaginationAsync(context, cancellationToken: cancellationToken);
        }

        public async Task<JsonElement?> ResolveNodeAsync(
            string id,
            [ScopedState("keyAndSpan")] SetState<KeyAndSpan> setKey,
            AssetPriceChangeDataLoader dataLoader,
            CancellationToken cancellationToken)
        {
            string[] parts = id.Split(':');
            ChangeSpan span = Enum.Parse<ChangeSpan>(parts[1]);
            var key = new KeyAndSpan(parts[0], span);
            setKey(key);
            return await dataLoader.LoadAsync(key, cancellationToken);
        }
    }
}