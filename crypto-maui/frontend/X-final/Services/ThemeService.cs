using AsyncAwaitBestPractices;

namespace MauiCrypto;

public class ThemeService
{
	public readonly static AsyncAwaitBestPractices.WeakEventManager<AppTheme> themeChangedEventManager = new();

	readonly IDispatcher dispatcher;
	readonly IPreferences preferences;

	public static event EventHandler<AppTheme> PreferredThemeChanged
	{
		add => themeChangedEventManager.AddEventHandler(value);
		remove => themeChangedEventManager.RemoveEventHandler(value);
	}

	public ThemeService(IDispatcher dispatcher, IPreferences preferences)
	{
		this.dispatcher = dispatcher;
		this.preferences = preferences;
	}

	public AppTheme PreferredTheme
	{
		get => preferences.Get(nameof(PreferredTheme), Application.Current?.RequestedTheme ?? AppTheme.Unspecified);
		set
		{
			if (PreferredTheme != value)
			{
				preferences.Set(nameof(PreferredTheme), value);
				SetAppTheme(value).SafeFireAndForget();
			}
		}
	}

	public Task Initialize()
	{
		if (App.Current is not null)
			App.Current.RequestedThemeChanged += HandleRequestedThemeChanged;

		return SetAppTheme(PreferredTheme);
	}

	Task SetAppTheme(AppTheme appTheme)
	{
		if (App.Current is null)
			return Task.CompletedTask;

		return dispatcher.DispatchAsync(() =>
		{
			App.Current.Resources = appTheme switch
			{
				AppTheme.Dark => new DarkTheme(),
				_ => new LightTheme()
			};
		});
	}

	void HandleResumed(object? sender, EventArgs e)
	{
		ArgumentNullException.ThrowIfNull(sender);

		App app = (App)sender;

		if (PreferredTheme is AppTheme.Unspecified)
			SetAppTheme(app.RequestedTheme);
	}

	void HandleRequestedThemeChanged(object? sender, AppThemeChangedEventArgs e)
	{
		if (PreferredTheme is AppTheme.Unspecified)
			SetAppTheme(e.RequestedTheme);
	}

	void OnPreferredThemeChanged(in AppTheme theme) => themeChangedEventManager.RaiseEvent(this, theme, nameof(PreferredThemeChanged));
}

