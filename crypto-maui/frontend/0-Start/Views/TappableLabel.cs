using System.Windows.Input;
using CommunityToolkit.Maui.Markup;

namespace MauiCrypto;

class TappableLabel : Label
{
	public static readonly BindableProperty CommandProperty = BindableProperty.Create(nameof(Command), typeof(ICommand), typeof(TappableLabel));
	public static readonly BindableProperty CommandParameterProperty = BindableProperty.Create(nameof(CommandProperty), typeof(object), typeof(TappableLabel));

	public TappableLabel()
	{
		GestureRecognizers.Add(
			new TapGestureRecognizer()
				.Invoke(gesture => gesture.Tapped += HandleLabelTapped));
	}

	public ICommand? Command
	{
		get => (ICommand)GetValue(CommandProperty);
		set => SetValue(CommandProperty, value);
	}

	public object? CommandParameter
	{
		get => (object?)GetValue(CommandParameterProperty);
		set => SetValue(CommandParameterProperty, value);
	}

	async void HandleLabelTapped(object? sender, EventArgs e)
	{
		var fadeAnimationTask = this.FadeTo(0, easing: Easing.CubicOut);
		await Task.Yield();

		if (Command?.CanExecute(CommandParameter) is true)
			Command.Execute(CommandParameter);

		await fadeAnimationTask;
		await this.FadeTo(1);
	}
}