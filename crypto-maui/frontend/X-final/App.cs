namespace MauiCrypto;

class App : Application
{
	readonly ThemeService _themeService;

	public App(AppShell shell, ThemeService themeService)
	{
		_themeService = themeService;
		Resources = new LightTheme();

		MainPage = shell;
	}

	protected override async void OnStart()
	{
		base.OnStart();
		await _themeService.Initialize();
	}
}