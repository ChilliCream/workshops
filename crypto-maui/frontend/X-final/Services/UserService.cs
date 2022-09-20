namespace MauiCrypto;

public class UserService
{
	const string _passwordKeyString = nameof(_passwordKeyString);

	readonly IPreferences _preferences;
	readonly ISecureStorage _secureStorage;

	public UserService(IPreferences preferences, ISecureStorage secureStorage) =>
		(_preferences, _secureStorage) = (preferences, secureStorage);

	public Uri GraphQLEndpoint
	{
		get => new Uri(_preferences.Get<string>(nameof(GraphQLEndpoint), "http://localhost:5100/graphql"));
		set => _preferences.Set<string>(nameof(GraphQLEndpoint), value.ToString());
	}

	public string Username
	{
		get => _preferences.Get(nameof(Username), string.Empty);
		set => _preferences.Set(nameof(Username), value);
	}

	public async Task<string> GetPassword() => await _secureStorage.GetAsync(_passwordKeyString).ConfigureAwait(false) ?? string.Empty;
	public Task SetPassword(in string value) => _secureStorage.SetAsync(_passwordKeyString, value);
}

