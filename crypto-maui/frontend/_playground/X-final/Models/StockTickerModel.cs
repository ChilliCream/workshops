using CommunityToolkit.Mvvm.ComponentModel;

namespace MauiCrypto;

class StockTickerModel : ObservableObject, IGetAssestsQuery_Assets_Nodes
{
    public StockTickerModel(IGetAssestsQuery_Assets_Nodes node) : this()
    {
        Id = node.Id;
        ImageUrl = node.ImageUrl;
        IsInWatchlist = node.IsInWatchlist;
        HasAlerts = node.HasAlerts;
        Symbol = node.Symbol;
        Name = node.Name;
        Slug = node.Slug;
        Description = node.Description;
        Color = node.Color;
        Website = node.Website;
        Price = node.Price;
    }

    public StockTickerModel()
    {

    }

    public string Id { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    public bool? IsInWatchlist { get; set; }

    public bool HasAlerts { get; set; }

    public string Symbol { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string Color { get; set; } = string.Empty;

    public string? Website { get; set; }

    public string? WhitePaper { get; set; }

#pragma warning disable CS8766 // Nullability of reference types in return type
    public IGetAssestsQuery_Assets_Nodes_Price? Price { get; set; }
#pragma warning restore
}

class StockTickerPriceModel : ObservableObject, IGetAssestsQuery_Assets_Nodes_Price
{
    public double LastPrice { get; set; }

    public double Change24Hour { get; set; }
}