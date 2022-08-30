using System;
using CommunityToolkit.Maui;
using CommunityToolkit.Maui.Converters;
using CommunityToolkit.Maui.Markup;
using static CommunityToolkit.Maui.Markup.GridRowsColumns;

namespace MauiCrypto;

class StockTickerView : CollectionView
{
	public const int OptimalHeight = 60;

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
			HeightRequest = OptimalHeight,
			WidthRequest = 100,

			RowDefinitions = Rows.Define(
				(Row.Symbol, 16),
				(Row.Price, 20),
				(Row.PercentChange, 16)),

			ColumnDefinitions = Columns.Define(
				(Column.Separator, 4),
				(Column.Content, Star)),

			Children =
			{
				new BoxView()
					.Width(2)
					.Start()
					.RowSpan(All<Row>()).Column(Column.Separator)
					.DynamicResource(BoxView.BackgroundColorProperty, nameof(BaseTheme.SeparatorColor)),

				new Label()
					.Row(Row.Symbol).Column(Column.Content)
					.Font(size: 12)
					.Bind<Label, string, string?>(Label.TextProperty, nameof(IGetAssestsQuery_Assets_Nodes.Symbol), convert: static symbol => symbol?.ToUpper())
					.Bind<Label, string, Color?>(Label.TextColorProperty, nameof(IGetAssestsQuery_Assets_Nodes.Color), convert: static colorHex => Color.FromArgb(colorHex)),

				new Label()
					.Row(Row.Price).Column(Column.Content)
					.Font(size: 16)
					.Bind<Label, double, string>(Label.TextProperty, $"{nameof(IGetAssestsQuery_Assets_Nodes.Price)}.{nameof(IGetAssestsQuery_Assets_Nodes.Price.LastPrice)}", convert: static price => price.ToString()),

				new Label()
					.Row(Row.PercentChange).Column(Column.Content)
					.Font(size: 12)
					.Bind<Label, double, string>(Label.TextProperty, $"{nameof(IGetAssestsQuery_Assets_Nodes.Price)}.{nameof(IGetAssestsQuery_Assets_Nodes.Price.Change24Hour)}", convert: static percentChange => $"{(double.IsNegative(percentChange) ? '-' : '+')}{Math.Abs(percentChange):P}")
					.Bind<Label, double, Color?>(Label.TextColorProperty, $"{nameof(IGetAssestsQuery_Assets_Nodes.Price)}.{nameof(IGetAssestsQuery_Assets_Nodes.Price.Change24Hour)}", convert: static percentChange => double.IsNegative(percentChange) ? (Color?)Application.Current?.Resources[nameof(BaseTheme.NegativeStockColor)] : (Color?)Application.Current?.Resources[nameof(BaseTheme.PositiveStockColor)] ),
			}
		};

		enum Row { Symbol, Price, PercentChange }
		enum Column { Separator, Content }
	}
}