using AsyncAwaitBestPractices;

namespace MauiCrypto;

public class ThemeService
{
	static readonly WeakEventManager<AppTheme> _themeChangedEventManager = new();

	readonly IDeviceInfo _deviceInfo;
	readonly IDispatcher _dispatcher;
	readonly IPreferences _preferences;

	public ThemeService(IDispatcher dispatcher, IPreferences preferences, IDeviceInfo deviceInfo)
	{
		_deviceInfo = deviceInfo;
		_dispatcher = dispatcher;
		_preferences = preferences;
	}

	public static event EventHandler<AppTheme> PreferredThemeChanged
	{
		add => _themeChangedEventManager.AddEventHandler(value);
		remove => _themeChangedEventManager.RemoveEventHandler(value);
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
				OnPreferredThemeChanged(value);
			}
		}
	}

	public Task Initialize()
	{
		if (Application.Current is not null)
			Application.Current.RequestedThemeChanged += HandleRequestedThemeChanged;

		return SetAppTheme(PreferredTheme);
	}

	Task SetAppTheme(AppTheme appTheme)
	{
		if (Application.Current is null || _deviceInfo.Platform == DevicePlatform.WinUI)
			return Task.CompletedTask;

		return _dispatcher.DispatchAsync(() =>
		{
			Application.Current.Resources = appTheme switch
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