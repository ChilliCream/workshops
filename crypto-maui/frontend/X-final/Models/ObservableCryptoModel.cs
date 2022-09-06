using System.ComponentModel;
using CommunityToolkit.Mvvm.ComponentModel;

namespace MauiCrypto;

partial class ObservableCryptoModel : ObservableObject, IGetAssestsQuery_Assets_Nodes
{
	[ObservableProperty]
	string id = string.Empty,
			name = string.Empty,
			slug = string.Empty,
			symbol = string.Empty,
			color = string.Empty;

	[ObservableProperty]
	string? imageUrl, description, website, whitePaper;

	[ObservableProperty]
	bool? isInWatchlist;

	[ObservableProperty]
	[NotifyPropertyChangedFor(nameof(PercentChangeText))]
	[NotifyPropertyChangedFor(nameof(PercentChangeTextColor))]
	IGetAssestsQuery_Assets_Nodes_Price? price;

	public ObservableCryptoModel(IGetAssestsQuery_Assets_Nodes node) : this()
	{
		Id = node.Id;
		ImageUrl = node.ImageUrl;
		IsInWatchlist = node.IsInWatchlist;
		Symbol = node.Symbol;
		Name = node.Name;
		Slug = node.Slug;
		Description = node.Description;
		Color = node.Color;
		Website = node.Website;
		Price = node.Price;
	}

	[EditorBrowsable(EditorBrowsableState.Never)]
	public ObservableCryptoModel()
	{

	}

	public string? PercentChangeText => Price?.Change24Hour is not null
										? $"{(double.IsNegative(Price?.Change24Hour ?? 0) ? '-' : '+')}{Math.Abs(Price?.Change24Hour ?? 0):P}"
										: null;

	public Color? PercentChangeTextColor => double.IsNegative(Price?.Change24Hour ?? 0)
											? (Color?)Application.Current?.Resources[nameof(BaseTheme.NegativeStockColor)]
											: (Color?)Application.Current?.Resources[nameof(BaseTheme.PositiveStockColor)];
}

partial class ObservableCryptoPriceModel : ObservableObject, IGetAssestsQuery_Assets_Nodes_Price
{
	[ObservableProperty]
	double lastPrice, change24Hour;
}