namespace MauiCrypto;

public class UserService
{
	const string passwordKeyString = nameof(passwordKeyString);

	readonly IPreferences preferences;
	readonly ISecureStorage secureStorage;

	public UserService(IPreferences preferences, ISecureStorage secureStorage) =>
		(this.preferences, this.secureStorage) = (preferences, secureStorage);

	public Uri GraphQLEndpoint
	{
		get => new Uri(preferences.Get<string>(nameof(GraphQLEndpoint), "http://localhost:5100/graphql"));
		set => preferences.Set<string>(nameof(GraphQLEndpoint), value.ToString());
	}

	public string Username
	{
		get => preferences.Get(nameof(Username), string.Empty);
		set => preferences.Set(nameof(Username), value);
	}

	public async Task<string> GetPassword() => await secureStorage.GetAsync(passwordKeyString).ConfigureAwait(false) ?? string.Empty;
	public Task SetPassword(in string value) => secureStorage.SetAsync(passwordKeyString, value);
}

