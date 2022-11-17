using System.Windows.Markup;
using CommunityToolkit.Maui.Markup;
using Microsoft.Maui;
using Microsoft.Maui.Controls.Shapes;
using static CommunityToolkit.Maui.Markup.GridRowsColumns;

namespace MauiCrypto;

class AssetChartTitleRowView : Grid
{
	public const int OptimalHeight = 48;

	const int _buttonHeight = 24;

	public AssetChartTitleRowView()
	{
		const int imageColumnWidth = 44;

		Padding = new Thickness(8, 4);

		ColumnDefinitions = Columns.Define(
			(Column.Icon, imageColumnWidth),
			(Column.Title, Auto),
			(Column.Symbol, Star),
			(Column.Notifications, 44),
			(Column.Favorite, 44));

		Children.Add(new Image()
						.Size(imageColumnWidth, OptimalHeight)
						.Column(Column.Icon)
						.Center()
						.Aspect(Aspect.AspectFit)
						.Bind(Image.SourceProperty, nameof(AssetChartViewModel.AssetImageUrl)));

		Children.Add(new TitleRowLabel(24) { LineBreakMode = LineBreakMode.TailTruncation }
						.Column(Column.Title)
						.Font(bold: true)
						.Bind(Label.TextProperty, nameof(AssetChartViewModel.AssetName))
						.DynamicResource(Label.TextColorProperty, nameof(BaseTheme.PrimaryTextColor)));

		Children.Add(new TitleRowImageButton()
						.Column(Column.Notifications)
						.Assign(out ImageButton notificationButton)
						.Source("notification_icon.png"));

		Children.Add(new TitleRowImageButton()
						.Column(Column.Favorite)
						.Source("not_favorite_icon.png"));

		Children.Add(new TitleRowLabel(14, Color.FromRgba(0, 0, 0, 0.08))
				.Column(Column.Symbol)
				.Bind<Label, double, double, RoundRectangleGeometry?>(
					Label.ClipProperty,
					binding1: new Binding(Label.WidthProperty.PropertyName, source: RelativeBindingSource.Self),
					binding2: new Binding(Label.HeightProperty.PropertyName, source: RelativeBindingSource.Self),
					convert: ConvertSymbolLabelClip)
				.Bind<Label, double, double, double, bool>(
					Label.IsVisibleProperty,
					binding1: new Binding(Label.WidthProperty.PropertyName, source: RelativeBindingSource.Self),
					binding2: new Binding(Label.XProperty.PropertyName, source: RelativeBindingSource.Self),
					binding3: new Binding(ImageButton.XProperty.PropertyName, source: notificationButton),
					convert: ConvertSymbolLabelVisibility)
				.Bind(Label.TextProperty, nameof(AssetChartViewModel.AssetSymbol))
				.DynamicResource(Label.TextColorProperty, nameof(BaseTheme.PrimaryTextColor)));

		static bool ConvertSymbolLabelVisibility((double Width, double X, double NotificationButtonX) values)
		{
			if (values.Width is -1) // A value of -1 indicates the controls haven't yet been drawn on screen
				return true;

			if (values.Width + values.X >= values.NotificationButtonX) // Label is overlapping the Notification Button
				return false;

			if (values.Width < 40) // Label is too small to display symbol charactors
				return false;

			return true;
		}

		static RoundRectangleGeometry? ConvertSymbolLabelClip((double Width, double Height) values)
		{
			if (values.Width is -1 || values.Height is -1)
			{
				return null;
			}

			return new RoundRectangleGeometry(new CornerRadius(8), new Rect(0, 0, values.Width, values.Height));
		}
	}

	enum Column { Icon, Title, Symbol, Notifications, Favorite }

	class TitleRowLabel : Label
	{
		public TitleRowLabel(double fontSize, Color? backgroundColor = null)
		{
			this.Font(size: fontSize)
				.Padding(8, 4).Margins(left: 4)
				.Start().CenterVertical()
				.TextStart().TextCenterVertical();

			BackgroundColor = backgroundColor;
		}
	}

	class TitleRowImageButton : ImageButton
	{
		public TitleRowImageButton()
		{
			this.Size(_buttonHeight).End();
		}
	}
}