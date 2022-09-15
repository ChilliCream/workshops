using AsyncAwaitBestPractices;
using CommunityToolkit.Mvvm.ComponentModel;

namespace MauiCrypto;

partial class SettingsViewModel : BaseViewModel
{
	readonly UserService _userService;

	[ObservableProperty]
	string _graphQLEndpointText, _usernameText, _passwordText = string.Empty;

	public SettingsViewModel(UserService userService, IDispatcher dispatcher) : base(dispatcher)
	{
		_userService = userService;

		InitializePassword().SafeFireAndForget();
		_usernameText = userService.Username;
		_graphQLEndpointText = userService.GraphQLEndpoint.ToString();

		async Task InitializePassword() => PasswordText = await userService.GetPassword();
	}

	partial void OnGraphQLEndpointTextChanged(string value)
	{
		if (Uri.TryCreate(value, UriKind.Absolute, out var uri))
			_userService.GraphQLEndpoint = uri;
	}

	partial void OnUsernameTextChanged(string value) => _userService.Username = value;

	async partial void OnPasswordTextChanged(string value)
	{
		if (!string.IsNullOrEmpty(value))
			await _userService.SetPassword(value).ConfigureAwait(false);
	}
}