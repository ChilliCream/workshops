using CommunityToolkit.Maui.Markup;

namespace MauiCrypto;

class SeparatorView : BoxView
{
	public const int RecommendedSeparatorViewSize = 2;

	public SeparatorView()
	{
		this.DynamicResource(BackgroundColorProperty, nameof(BaseTheme.SeparatorColor));
	}
}

