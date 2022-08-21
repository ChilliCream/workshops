using System;
using CommunityToolkit.Maui;
using CommunityToolkit.Maui.Converters;
using CommunityToolkit.Maui.Markup;
using static CommunityToolkit.Maui.Markup.GridRowsColumns;

namespace MauiCrypto;

class StockTickerView : CollectionView
{
	public StockTickerView()
	{
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
			HeightRequest = 48,
			WidthRequest = 100,

			RowDefinitions = Rows.Define(
				(Row.Symbol, 12),
				(Row.Price, 16),
				(Row.PercentChange, 12)),

			ColumnDefinitions = Columns.Define(
				(Column.Separator, 4),
				(Column.Content, Star)),

			Children =
			{
				new BoxView()
					.Size(2, -1)
					.Start()
					.RowSpan(All<Row>()).Column(Column.Separator)
					.DynamicResource(BoxView.BackgroundColorProperty, nameof(BaseTheme.SeparatorColor)),

				new Label()
					.Row(Row.Symbol).Column(Column.Content)
					.Font(size: 12)
					.Bind<Label, string, string?>(Label.TextProperty, nameof(StockTickerModel.Symbol), convert: static symbol => symbol?.ToUpper())
					.Bind(Label.TextColorProperty, nameof(StockTickerModel.SymbolColor)),

				new Label()
					.Row(Row.Price).Column(Column.Content)
					.Font(size: 16)
					.Bind<Label, decimal, string>(Label.TextProperty, nameof(StockTickerModel.Price), convert: static price => price.ToString()),

				new Label()
					.Row(Row.PercentChange).Column(Column.Content)
					.Font(size: 12)
					.Bind<Label, double, string>(Label.TextProperty, nameof(StockTickerModel.PercentChange), convert: static percentChange => $"{(double.IsNegative(percentChange) ? '-' : '+')}{Math.Abs(percentChange):P}")
					.Bind<Label, double, Color?>(Label.TextColorProperty, nameof(StockTickerModel.PercentChange), convert: static percentChange => double.IsNegative(percentChange) ? (Color?)Application.Current?.Resources[nameof(BaseTheme.NegativeStockColor)] : (Color?)Application.Current?.Resources[nameof(BaseTheme.PositiveStockColor)] ),
			}
		};

		enum Row { Symbol, Price, PercentChange }
		enum Column { Separator, Content }
	}
}

