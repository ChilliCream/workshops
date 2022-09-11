using AsyncAwaitBestPractices;
using CommunityToolkit.Mvvm.ComponentModel;

namespace MauiCrypto;

partial class SettingsViewModel : BaseViewModel
{
	readonly UserService userService;

	[ObservableProperty]
	string graphQLEndpointText, usernameText, passwordText = string.Empty;

	public SettingsViewModel(UserService userService)
	{
		this.userService = userService;

		InitializePassword().SafeFireAndForget();
		usernameText = userService.Username;
		graphQLEndpointText = userService.GraphQLEndpoint.ToString();

		async Task InitializePassword() => PasswordText = await userService.GetPassword().ConfigureAwait(false);
	}

	partial void OnGraphQLEndpointTextChanged(string value)
	{
		if (Uri.TryCreate(value, UriKind.Absolute, out var uri))
			userService.GraphQLEndpoint = uri;
	}

	partial void OnUsernameTextChanged(string value) => userService.Username = value;
	async partial void OnPasswordTextChanged(string value) => await userService.SetPassword(value).ConfigureAwait(false);
}