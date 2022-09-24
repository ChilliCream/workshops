using AsyncAwaitBestPractices;

namespace MauiCrypto;

public class ThemeService
{
	static readonly WeakEventManager<AppTheme> _themeChangedEventManager = new();

	readonly IDispatcher _dispatcher;
	readonly IPreferences _preferences;

	public static event EventHandler<AppTheme> PreferredThemeChanged
	{
		add => _themeChangedEventManager.AddEventHandler(value);
		remove => _themeChangedEventManager.RemoveEventHandler(value);
	}

	public ThemeService(IDispatcher dispatcher, IPreferences preferences)
	{
		_dispatcher = dispatcher;
		_preferences = preferences;
	}

	public AppTheme PreferredTheme
	{
		get => (AppTheme)_preferences.Get<int>(nameof(PreferredTheme), (int)(Application.Current?.RequestedTheme ?? AppTheme.Unspecified));
		set
		{
			if (PreferredTheme != value)
			{
				_preferences.Set<int>(nameof(PreferredTheme), (int)value);
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

		return _dispatcher.DispatchAsync(() =>
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

	void OnPreferredThemeChanged(in AppTheme theme) => _themeChangedEventManager.RaiseEvent(this, theme, nameof(PreferredThemeChanged));
}