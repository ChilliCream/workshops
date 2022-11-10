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
		SelectionMode = SelectionMode.Single;
		ItemsLayout = LinearItemsLayout.Horizontal;
		ItemTemplate = new StockTickerDataTemplate();
		HorizontalScrollBarVisibility = ScrollBarVisibility.Never;

		this.Bind(CollectionView.SelectionChangedCommandProperty, nameof(BaseViewModel.CollectionViewSelectionChangedCommand), BindingMode.OneTime)
			.Bind(CollectionView.SelectionChangedCommandParameterProperty, mode: BindingMode.OneTime, source: new RelativeBindingSource(RelativeBindingSourceMode.Self));
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
					.Bind(Label.TextProperty, nameof(IGetAssestsQuery_Assets_Nodes.Symbol), BindingMode.OneTime, convert: static (string? symbol) => symbol?.ToUpper())
					.Bind(Label.TextColorProperty, nameof(IGetAssestsQuery_Assets_Nodes.Color), BindingMode.OneTime, convert: static (string? colorHex) => Color.FromArgb(colorHex)),

				new Label()
					.Row(Row.Price).Column(Column.Content)
					.Font(size: 16)
					.Bind(Label.TextProperty, $"{nameof(IGetAssestsQuery_Assets_Nodes.Price)}.{nameof(IGetAssestsQuery_Assets_Nodes.Price.LastPrice)}", BindingMode.OneTime),

				new Label()
					.Row(Row.PercentChange).Column(Column.Content)
					.Font(size: 12)
					.Bind(Label.TextProperty, $"{nameof(ObservableCryptoModel.PercentChangeText)}", BindingMode.OneTime)
					.Bind(Label.TextColorProperty,nameof(ObservableCryptoModel.PercentChangeTextColor), BindingMode.OneTime)
			}
		};

		enum Row { Symbol, Price, PercentChange, BottomPadding }
		enum Column { Separator, Content }
	}
}