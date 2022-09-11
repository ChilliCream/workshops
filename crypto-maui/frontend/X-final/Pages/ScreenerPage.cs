using CommunityToolkit.Maui.Markup;

namespace MauiCrypto;

class ScreenerPage : BasePage<ScreenerViewModel>
{
	public ScreenerPage(ScreenerViewModel screenerViewModel) : base(screenerViewModel, "Screener")
	{
		Padding = new Thickness(Padding.Left, 0, Padding.Right, 0);

		Content = new VerticalStackLayout
		{
			Spacing = 0,

			Children =
			{
				new SearchBar()
					.Placeholder("Filter")
					.Bind(SearchBar.TextProperty, nameof(ScreenerViewModel.FilterText))
					.DynamicResource(SearchBar.TextColorProperty, nameof(BaseTheme.PrimaryTextColor)),

				new CollectionView()
					.ItemTemplate(new TopPerformersDataTemplate())
					.Bind(CollectionView.ItemsSourceProperty, nameof(ScreenerViewModel.FilteredAssetList))
			}
		};
	}
}