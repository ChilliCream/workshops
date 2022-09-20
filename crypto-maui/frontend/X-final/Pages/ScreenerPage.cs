using CommunityToolkit.Maui.Markup;

namespace MauiCrypto;

class ScreenerPage : BasePage<ScreenerViewModel>
{
	public ScreenerPage(ScreenerViewModel screenerViewModel, IDispatcher dispatcher) : base(screenerViewModel, dispatcher, "Screener", false)
	{
		Padding = 0;

		Content = new VerticalStackLayout
		{
			Spacing = 0,

			Children =
			{
				new SearchBar()
					.Placeholder("Filter")
					.Assign(out SearchBar searchBar)
					.Bind(SearchBar.TextProperty, nameof(ScreenerViewModel.FilterText))
					.DynamicResource(SearchBar.TextColorProperty, nameof(BaseTheme.PrimaryTextColor)),

				new CollectionView { SelectionMode = SelectionMode.Single }
					.ItemTemplate(new TopPerformersDataTemplate())
#if IOS
					.Bind(CollectionView.HeightRequestProperty, SearchBar.HeightProperty.PropertyName, source: searchBar, convert: (double searchBarHeight) => this.Height - searchBarHeight)
#endif
					.Bind(CollectionView.ItemsSourceProperty, nameof(ScreenerViewModel.FilteredAssetList))
					.Bind(CollectionView.SelectionChangedCommandProperty, nameof(BaseViewModel.CollectionViewSelectionChangedCommand))
					.Bind(CollectionView.SelectionChangedCommandParameterProperty, source: new RelativeBindingSource(RelativeBindingSourceMode.Self))
			}
		};
	}
}