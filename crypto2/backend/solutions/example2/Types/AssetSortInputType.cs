using HotChocolate.Data.Sorting;

namespace Demo.Types;

public sealed class AssetSortInputType : SortInputType<Asset>
{
    protected override void Configure(ISortInputTypeDescriptor<Asset> descriptor)
    {
        descriptor.BindFieldsExplicitly();
        descriptor.Field(t => t.Symbol);
        descriptor.Field(t => t.Slug);
        descriptor.Field(t => t.Name);
        descriptor.Field(t => t.Price);
    }
}
