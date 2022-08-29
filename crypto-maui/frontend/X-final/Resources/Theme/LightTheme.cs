using System;
using CommunityToolkit.Maui.Markup;

namespace MauiCrypto;

class LightTheme : BaseTheme
{
	public override Color PageBackgroundColor { get; } = Colors.White;
	public override Color FlyoutBackgroundColor { get; } = Colors.White;

	public override Color PrimaryTextColor { get; } = Color.FromRgba(0, 0, 0, 0.87);
	public override Color SecondaryTextColor { get; } = Color.FromRgb(255, 140, 0);

	public override Color SeparatorColor { get; } = Color.FromRgba(0, 0, 0, 0.12);
}