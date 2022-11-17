using System;
using CommunityToolkit.Maui.Markup;
using static CommunityToolkit.Maui.Markup.GridRowsColumns;

namespace MauiCrypto;

class TopPerformersDataTemplate : DataTemplate
{
	public const int OptimalHeight = _verticalPadding + _nameRowHeight + _symbolRowHeight + _verticalPadding + SeparatorView.RecommendedSeparatorViewSize;

	const int _iconRadius = 32;
	const int _nameRowHeight = 20;
	const int _verticalPadding = 8;
	const int _symbolRowHeight = 20;
	const int _iconHorizontalPadding = 4;

	public TopPerformersDataTemplate() : base(CreateDataTemplate)
	{

	}

	static Grid CreateDataTemplate() => new()
	{
		Padding = new Thickness(8, 0),

		RowDefinitions = Rows.Define(
			(Row.TopPadding, _verticalPadding),
			(Row.Name, _nameRowHeight),
			(Row.Symbol, _symbolRowHeight),
			(Row.BottomPadding, _verticalPadding),
			(Row.Separator, SeparatorView.RecommendedSeparatorViewSize)),

		ColumnDefinitions = Columns.Define(
			(Column.Icon, _iconRadius + _iconHorizontalPadding * 2),
			(Column.TextPadding, 8),
			(Column.Text, Star),
			(Column.PercentChange, 100),
			(Column.Favorite, 56)),

		Children =
		{
			new Image()
				.Row(Row.Name).RowSpan(2).Column(Column.Icon)
				.Bind(Image.SourceProperty, nameof(IGetAssestsQuery_Assets_Nodes.ImageUrl)),

			new Label()
				.Row(Row.Name).Column(Column.Text)
				.TextStart().TextCenterVertical()
				.Font(size: 13)
				.Bind(Label.TextProperty, nameof(IGetAssestsQuery_Assets_Nodes.Name))
				.DynamicResource(Label.TextColorProperty, nameof(BaseTheme.SecondaryTextColor)),

			new Label()
				.Row(Row.Symbol).Column(Column.Text)
				.TextStart().TextCenterVertical()
				.Font(size: 14)
				.Bind(Label.TextProperty, nameof(IGetAssestsQuery_Assets_Nodes.Symbol))
				.DynamicResource(Label.TextColorProperty, nameof(BaseTheme.PrimaryTextColor)),

			new Label()
				.Row(Row.Name).RowSpan(2).Column(Column.PercentChange)
				.TextEnd().TextCenterVertical()
				.Font(size: 16)
				.Bind(Label.TextProperty, nameof(ObservableCryptoModel.PercentChangeText))
				.Bind(Label.TextColorProperty, nameof(ObservableCryptoModel.PercentChangeTextColor)),

			new ImageButton()
				.Row(Row.Name).RowSpan(2).Column(Column.Favorite)
				.Center()
				.Source("not_favorite_icon.png"),

			new SeparatorView()
				.Row(Row.Separator).ColumnSpan(All<Column>())
		}
	};

	enum Row { TopPadding, Name, Symbol, BottomPadding, Separator }
	enum Column { Icon, TextPadding, Text, PercentChange, Favorite }
}