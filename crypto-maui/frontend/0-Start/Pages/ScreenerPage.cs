using CommunityToolkit.Maui.Markup;

namespace MauiCrypto;

class ScreenerPage : BasePage<ScreenerViewModel>
{
	public ScreenerPage(ScreenerViewModel screenerViewModel, IDispatcher dispatcher) : base(screenerViewModel, dispatcher, "Screener", false)
	{

	}
}