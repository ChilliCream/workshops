using CommunityToolkit.Maui.Markup;

namespace MauiCrypto;

class ScreenerPage : BasePage<ScreenerViewModel>
{
	public ScreenerPage(ScreenerViewModel screenerViewModel) : base(screenerViewModel, "Screener")
	{
		Padding = new Thickness(Padding.Left, 0, Padding.Right, 0);

		Content = new CollectionView()
						.Bind(CollectionView.ItemsSourceProperty, nameof(ScreenerViewModel.AssetList))
						.ItemTemplate(new TopPerformersDataTemplate());
	}
}