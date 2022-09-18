using CommunityToolkit.Maui.Markup;
using static CommunityToolkit.Maui.Markup.GridRowsColumns;

namespace MauiCrypto;

class AssetChartPriceRowView : Grid
{
	public AssetChartPriceRowView()
	{
		this.Center().Margins(top: 8);

		RowDefinitions = Rows.Define(
			(Row.Top, Star),
			(Row.Bottom, Star));

		ColumnDefinitions = Columns.Define(
			(Column.Dollars, Auto),
			(Column.Cents, 36),
			(Column.PercentChange, Auto));

		Children.Add(new PriceLabel()
						.Column(Column.Dollars).RowSpan(All<Row>())
						.Font(size: 48, bold: true)
						.Bind<Label, double, string>(Label.TextProperty, nameof(AssetChartViewModel.CurrentPrice), convert: ConvertToDollars));

		Children.Add(new PriceLabel()
						.Column(Column.Cents).Row(Row.Top)
						.Font(size: 24, bold: true)
						.Bind<Label, double, string>(Label.TextProperty, nameof(AssetChartViewModel.CurrentPrice), convert: ConvertToCents));

		Children.Add(new Label()
						.Column(Column.PercentChange).Row(Row.Top)
						.Center().TextCenter()
						.Font(size: 18)
						.Margins(left: 4)
						.Bind(Label.TextProperty, nameof(AssetChartViewModel.LastestPriceChangeText))
						.Bind(Label.TextColorProperty, nameof(AssetChartViewModel.LastestPriceChangeTextColor)));
	}

	static string ConvertToDollars(double price) => Math.Round(price, 0, MidpointRounding.ToZero).ToString("C0");
	static string ConvertToCents(double price) => Math.Round(price % 1 * 100, 0, MidpointRounding.ToZero).ToString("00");

	enum Row { Top, Bottom }
	enum Column { Dollars, Cents, PercentChange }

	class PriceLabel : Label
	{
		public PriceLabel()
		{
			this.Center().TextCenter().DynamicResource(Label.TextColorProperty, nameof(BaseTheme.PrimaryTextColor));
		}
	}
}

