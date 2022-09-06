using CommunityToolkit.Maui.Markup;
using static CommunityToolkit.Maui.Markup.GridRowsColumns;

namespace MauiCrypto;

public class TopGainersView : Grid
{
	public TopGainersView()
	{
		RowDefinitions = Rows.Define(
			(Row.Title, 48),
			(Row.Collection, Auto));

		ColumnDefinitions = Columns.Define(
			(Column.Icon, 24),
			(Column.TitleText, Star),
			(Column.Toggle, 24));

		Children.Add(new Image()
						.Row(Row.Title).Column(Column.Icon)
						.Source("top_gainers_icon"));

		Children.Add(new Label()
						.Row(Row.Title).Column(Column.TitleText)
						.Text("Top Gainers")
						.TextCenterVertical()
						.TextStart()
						.Fill()
						.Font(size: 18)
						.Margins(left: 24));

		Children.Add(new Image()
						.Row(Row.Title).Column(Column.Toggle)
						.Source("toggle_icon"));
	}

	enum Row { Title, Collection }
	enum Column { Icon, TitleText, Toggle }
}

