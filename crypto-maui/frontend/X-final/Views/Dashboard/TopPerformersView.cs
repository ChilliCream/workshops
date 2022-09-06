using CommunityToolkit.Maui.Markup;
using Microsoft.Maui.Controls.Shapes;
using static CommunityToolkit.Maui.Markup.GridRowsColumns;

namespace MauiCrypto;

class TopPerformersView : Grid
{
	public const int OptimalHeight = titleRowHeight + collectionRowHeight;
	public const int NumberOfPerformers = 5;

	const int collectionRowHeight = TopPerformersDataTemplate.OptimalHeight * NumberOfPerformers;
	const int titleRowHeight = 48;

	public TopPerformersView(in string icon, in string title, in string collectionViewItemSourceBindingPath)
	{
		this.FillHorizontal();

		ColumnSpacing = 8;

		RowDefinitions = Rows.Define(
			(Row.Title, titleRowHeight),
			(Row.Collection, collectionRowHeight));

		ColumnDefinitions = Columns.Define(
			(Column.Icon, 24),
			(Column.TitleText, Star),
			(Column.Toggle, 24));

		Children.Add(new Image()
						.Row(Row.Title).Column(Column.Icon)
						.Source(icon));

		Children.Add(new Label()
						.Row(Row.Title).Column(Column.TitleText)
						.Text(title)
						.TextCenterVertical()
						.TextStart()
						.Fill()
						.Font(size: 18)
						.Margins(left: 24));

		Children.Add(new Image()
						.Row(Row.Title).Column(Column.Toggle)
						.Source("toggle_icon"));

		Children.Add(new CollectionView()
						.Row(Row.Collection).ColumnSpan(All<Column>())
						.ItemTemplate(new TopPerformersDataTemplate())
						.Bind(CollectionView.ItemsSourceProperty, collectionViewItemSourceBindingPath));
	}

	enum Row { Title, Collection }
	enum Column { Icon, TitleText, Toggle }
}

