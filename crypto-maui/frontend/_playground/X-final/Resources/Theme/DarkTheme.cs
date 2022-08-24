using System;

namespace MauiCrypto;

class DarkTheme : BaseTheme
{
	public override Color PageBackgroundColor { get; } = Color.FromArgb("121212");
	public override Color FlyoutBackgroundColor { get; } = Color.FromArgb("353535");

	public override Color PrimaryTextColor { get; } = Colors.White;
	public override Color SecondaryTextColor { get; } = Color.FromRgb(255, 140, 0);

	public override Color SeparatorColor { get; } = Color.FromRgba(255, 255, 255, 0.12);
}