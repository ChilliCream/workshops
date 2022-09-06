namespace MauiCrypto;

class App : Application
{
	readonly ThemeService themeService;

	public App(AppShell shell, ThemeService themeService)
	{
		this.themeService = themeService;
		MainPage = shell;
	}

	protected override async void OnStart()
	{
		base.OnStart();
		await themeService.Initialize();
	}
}