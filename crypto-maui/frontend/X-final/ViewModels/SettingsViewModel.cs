using CommunityToolkit.Mvvm.ComponentModel;

namespace MauiCrypto;

partial class SettingsViewModel : BaseViewModel
{
	readonly IPreferences preferences;

	[ObservableProperty]
	string graphQLEndpointText, usernameText, passwordText;

	public SettingsViewModel(IPreferences preferences)
	{
		this.preferences = preferences;

		graphQLEndpointText = preferences.Get(nameof(GraphQLEndpointText), "http://10.0.2.2:5100/graphql");
		usernameText = preferences.Get(nameof(UsernameText), string.Empty);
		passwordText = preferences.Get(nameof(PasswordText), string.Empty);
	}

	partial void OnGraphQLEndpointTextChanged(string value) => preferences.Set(nameof(GraphQLEndpointText), value);
	partial void OnUsernameTextChanged(string value) => preferences.Set(nameof(UsernameText), value);
	partial void OnPasswordTextChanged(string value) => preferences.Set(nameof(PasswordText), value);
}