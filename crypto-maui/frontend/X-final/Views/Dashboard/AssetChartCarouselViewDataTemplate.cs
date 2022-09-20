using CommunityToolkit.Maui.Markup;
using Microsoft.Maui;
using Microsoft.Maui.Controls.Shapes;
using static CommunityToolkit.Maui.Markup.GridRowsColumns;

namespace MauiCrypto;

class AssetChartCarouselViewDataTemplate : DataTemplate
{
	public AssetChartCarouselViewDataTemplate() : base(CreateDataTemplate)
	{

	}

	static View CreateDataTemplate() => new ChartCard();

	class ChartCard : Border
	{
		public ChartCard()
		{
			Padding = new Thickness(16, 0);

			StrokeShape = new RoundRectangle { CornerRadius = 4 };
			StrokeThickness = 1;

			this.DynamicResource(StrokeProperty, nameof(BaseTheme.SeparatorColor));

			Content = new Grid
			{
				RowDefinitions = Rows.Define(
					(Row.Text, 52),
					(Row.Chart, 152)),

				ColumnDefinitions = Columns.Define(
					(Column.Symbol, 56),
					(Column.Price, 75),
					(Column.PercentChange, Star)),

				Children =
				{
					new Label()
						.Row(Row.Text).Column(Column.Symbol)
						.TextStart().TextCenterVertical().Font(bold: true, size: 16)
						.Bind(Label.TextProperty, nameof(ObservableAssetPriceHistoryModel.Symbol))
						.Bind(Label.TextColorProperty, nameof(ObservableAssetPriceHistoryModel.Color)),

					new Label()
						.Row(Row.Text).Column(Column.Price)
						.TextCenter().Font(size: 16)
						.Bind(Label.TextProperty, nameof(ObservableAssetPriceHistoryModel.LatestPrice), convert: static (double price) => $"{price:C2}"),

					new Label()
						.Row(Row.Text).Column(Column.PercentChange)
						.TextStart().TextCenterVertical().Font(size: 16)
						.Bind<Label, double, string>(Label.TextProperty, nameof(ObservableAssetPriceHistoryModel.PercentChange), convert: static (double change) => double.IsNegative(change)
																																										? $"-{change:P2}"
																																										: $"+{change:P2}")
						.Bind(Label.TextColorProperty, nameof(ObservableAssetPriceHistoryModel.PercentChange), convert: static (double change) => double.IsNegative(change)
																																					? (Color?)Application.Current?.Resources[nameof(BaseTheme.NegativeStockColor)]
																																					: (Color?)Application.Current?.Resources[nameof(BaseTheme.PositiveStockColor)]),

					new PriceHistoryChartView(false)
						.Row(Row.Chart).ColumnSpan(All<Column>())
				}
			};
		}

		enum Row { Text, Chart }
		enum Column { Symbol, Price, PercentChange }
	}
}

