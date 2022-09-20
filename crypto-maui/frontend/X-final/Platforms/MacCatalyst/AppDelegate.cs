using Foundation;

namespace MauiCrypto;

[Register(nameof(AppDelegate))]
public class AppDelegate : MauiUIApplicationDelegate
{
	protected override MauiApp CreateMauiApp() => MauiProgram.CreateMauiApp(new UserService(Preferences.Default, SecureStorage.Default));
}