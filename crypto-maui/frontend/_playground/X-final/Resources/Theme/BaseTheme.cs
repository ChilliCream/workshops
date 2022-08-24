using CommunityToolkit.Maui.Markup;

namespace MauiCrypto;

abstract class BaseTheme : ResourceDictionary
{
	public BaseTheme()
	{
		Add(nameof(PageBackgroundColor), PageBackgroundColor);
		Add(nameof(FlyoutBackgroundColor), FlyoutBackgroundColor);

		Add(nameof(PrimaryTextColor), PrimaryTextColor);
		Add(nameof(SecondaryTextColor), SecondaryTextColor);

		Add(nameof(PositiveStockColor), PositiveStockColor);
		Add(nameof(NegativeStockColor), NegativeStockColor);

		Add(nameof(SeparatorColor), SeparatorColor);

		Add(new Style<Shell>(
				(Shell.NavBarHasShadowProperty, true),
				(Shell.TitleColorProperty, PrimaryTextColor),
				(Shell.DisabledColorProperty, PrimaryTextColor),
				(Shell.UnselectedColorProperty, PrimaryTextColor),
				(Shell.ForegroundColorProperty, PrimaryTextColor),
				(Shell.BackgroundColorProperty, FlyoutBackgroundColor)).ApplyToDerivedTypes(true));

		Add(new Style<NavigationPage>(
				(NavigationPage.BarTextColorProperty, PrimaryTextColor),
				(NavigationPage.BarBackgroundColorProperty, PageBackgroundColor)).ApplyToDerivedTypes(true));
	}

	public abstract Color PageBackgroundColor { get; }
	public abstract Color FlyoutBackgroundColor { get; }

	public abstract Color PrimaryTextColor { get; }
	public abstract Color SecondaryTextColor { get; }

	public abstract Color SeparatorColor { get; }

	public Color PositiveStockColor { get; } = Color.FromRgb(9, 133, 81);
	public Color NegativeStockColor { get; } = Color.FromRgb(207, 32, 47);

}