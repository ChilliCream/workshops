using System;
using CommunityToolkit.Maui;
using CommunityToolkit.Maui.Converters;
using CommunityToolkit.Maui.Markup;
using static CommunityToolkit.Maui.Markup.GridRowsColumns;

namespace MauiCrypto;

class CryptoTickerView : CollectionView
{
	public const int OptimalHeight = 64;

	public CryptoTickerView()
	{
		this.CenterVertical();
		HeightRequest = OptimalHeight;
		ItemsLayout = LinearItemsLayout.Horizontal;
		ItemTemplate = new StockTickerDataTemplate();
		HorizontalScrollBarVisibility = ScrollBarVisibility.Never;
	}

	class StockTickerDataTemplate : DataTemplate
	{
		public StockTickerDataTemplate() : base(CreateDataTemplate)
		{

		}

		static Grid CreateDataTemplate() => new()
		{
			RowSpacing = 4,
			ColumnSpacing = 12,
			WidthRequest = 100,

			RowDefinitions = Rows.Define(
				(Row.Symbol, 16),
				(Row.Price, 20),
				(Row.PercentChange, 16),
				(Row.BottomPadding, 4)),

			ColumnDefinitions = Columns.Define(
				(Column.Separator, SeparatorView.RecommendedSeparatorViewSize),
				(Column.Content, Star)),

			Children =
			{
				new SeparatorView()
					.RowSpan(3).Column(Column.Separator)
					.Width(SeparatorView.RecommendedSeparatorViewSize),

				new Label()
					.Row(Row.Symbol).Column(Column.Content)
					.Font(size: 12)
					.Bind<Label, string, string?>(Label.TextProperty, nameof(IGetAssestsQuery_Assets_Nodes.Symbol), convert: static symbol => symbol?.ToUpper())
					.Bind<Label, string, Color?>(Label.TextColorProperty, nameof(IGetAssestsQuery_Assets_Nodes.Color), convert: static colorHex => Color.FromArgb(colorHex)),

				new Label()
					.Row(Row.Price).Column(Column.Content)
					.Font(size: 16)
					.Bind(Label.TextProperty, $"{nameof(IGetAssestsQuery_Assets_Nodes.Price)}.{nameof(IGetAssestsQuery_Assets_Nodes.Price.LastPrice)}"),

				new Label()
					.Row(Row.PercentChange).Column(Column.Content)
					.Font(size: 12)
					.Bind(Label.TextProperty, $"{nameof(ObservableCryptoModel.PercentChangeText)}")
					.Bind(Label.TextColorProperty,nameof(ObservableCryptoModel.PercentChangeTextColor))
			}
		};

		enum Row { Symbol, Price, PercentChange, BottomPadding }
		enum Column { Separator, Content }
	}
}