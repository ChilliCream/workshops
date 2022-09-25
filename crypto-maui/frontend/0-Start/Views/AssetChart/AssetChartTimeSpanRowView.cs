using System.Windows.Input;
using CommunityToolkit.Maui.Behaviors;
using CommunityToolkit.Maui.Markup;
using static CommunityToolkit.Maui.Markup.GridRowsColumns;

namespace MauiCrypto;

public class AssetChartTimeSpanRowView : Grid
{
	public const int OptimalHeight = 40;

	const int _columnWidth = OptimalHeight;

	public AssetChartTimeSpanRowView()
	{
		this.Center();

		ColumnDefinitions = Columns.Define(
			(Column.Hour, _columnWidth),
			(Column.Day, _columnWidth),
			(Column.Week, _columnWidth),
			(Column.Month, _columnWidth),
			(Column.Year, _columnWidth),
			(Column.All, _columnWidth));

		Children.Add(new TimespanRowLabel { CommandParameter = ChangeSpan.Hour }
						.Column(Column.Hour)
						.Text("1H")
						.Bind(TappableLabel.CommandProperty, nameof(AssetChartViewModel.UpdateChangeSpanCommand)));

		Children.Add(new TimespanRowLabel { CommandParameter = ChangeSpan.Day }
						.Column(Column.Day)
						.Text("1D")
						.Bind(TappableLabel.CommandProperty, nameof(AssetChartViewModel.UpdateChangeSpanCommand)));

		Children.Add(new TimespanRowLabel { CommandParameter = ChangeSpan.Week }
						.Column(Column.Week)
						.Text("1W")
						.Bind(TappableLabel.CommandProperty, nameof(AssetChartViewModel.UpdateChangeSpanCommand)));

		Children.Add(new TimespanRowLabel { CommandParameter = ChangeSpan.Month }
						.Column(Column.Month)
						.Text("1M")
						.Bind(TappableLabel.CommandProperty, nameof(AssetChartViewModel.UpdateChangeSpanCommand)));

		Children.Add(new TimespanRowLabel { CommandParameter = ChangeSpan.Year }
						.Column(Column.Year)
						.Text("1Y")
						.Bind(TappableLabel.CommandProperty, nameof(AssetChartViewModel.UpdateChangeSpanCommand)));

		Children.Add(new TimespanRowLabel { CommandParameter = ChangeSpan.All }
						.Column(Column.All)
						.Text("All")
						.Bind(TappableLabel.CommandProperty, nameof(AssetChartViewModel.UpdateChangeSpanCommand)));

	}

	enum Column { Hour, Day, Week, Month, Year, All }

	class TimespanRowLabel : TappableLabel
	{
		public TimespanRowLabel()
		{
			this.Font(size: 16)
				.Center().TextCenter()
				.DynamicResource(Label.TextColorProperty, nameof(BaseTheme.PrimaryTextColor));
		}
	}
}