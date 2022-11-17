using System.Diagnostics;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Maui.Controls.PlatformConfiguration;
using Microsoft.Maui.Controls.PlatformConfiguration.iOSSpecific;

namespace MauiCrypto;

abstract class BasePage<TViewModel> : BasePage where TViewModel : BaseViewModel
{
	protected BasePage(in TViewModel viewModel, in string? title = null, in bool shouldUseSafeArea = true) : base(viewModel, title)
	{
		BaseViewModel.HttpClientError += HandleHttpClientError;

		On<iOS>().SetUseSafeArea(shouldUseSafeArea);
		On<iOS>().SetModalPresentationStyle(UIModalPresentationStyle.FormSheet);
	}

	public new TViewModel BindingContext => (TViewModel)base.BindingContext;

	async void HandleHttpClientError(object? sender, string e) =>
		await Dispatcher.DispatchAsync(() => DisplayAlert("GraphQL Connection Failed", e, "OK"));
}

abstract partial class BasePage : ContentPage
{
	protected BasePage(in object? viewModel = null, in string? title = null)
	{
		BindingContext = viewModel;
		Title = title;
		Padding = 12;

		SetDynamicResource(BackgroundColorProperty, nameof(BaseTheme.PageBackgroundColor));

		if (string.IsNullOrWhiteSpace(Title))
		{
			Title = GetType().Name;
		}
	}

	protected override void OnAppearing()
	{
		base.OnAppearing();

		Debug.WriteLine($"OnAppearing: {Title}");
	}

	protected override void OnDisappearing()
	{
		base.OnDisappearing();

		Debug.WriteLine($"OnDisappearing: {Title}");
	}
}