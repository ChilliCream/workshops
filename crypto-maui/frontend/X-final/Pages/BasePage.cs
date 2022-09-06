using System.Diagnostics;

namespace MauiCrypto;

public abstract class BasePage<TViewModel> : BasePage where TViewModel : BaseViewModel
{
	protected BasePage(in TViewModel viewModel, in string? title = null) : base(viewModel, title)
	{
	}

	public new TViewModel BindingContext => (TViewModel)base.BindingContext;
}

public abstract class BasePage : ContentPage
{
	protected BasePage(in object? viewModel = null, in string? title = null)
	{
		BindingContext = viewModel;
		Title = title;
		Padding = 12;

		SetDynamicResource(BackgroundColorProperty, "AppBackgroundColor");

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