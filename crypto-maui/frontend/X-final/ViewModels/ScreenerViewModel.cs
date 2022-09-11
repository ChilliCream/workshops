using System.Collections.Specialized;
using CommunityToolkit.Mvvm.ComponentModel;

namespace MauiCrypto;

partial class ScreenerViewModel : BaseViewModel
{
	readonly IDispatcherTimer dispatchertimer;

	[ObservableProperty]
	string filterText = string.Empty;

	public ScreenerViewModel(IDispatcher dispatcher, CryptoGraphQLService cryptoGraphQLService)
	{
		SubscribeOnPriceChangeSession ??= cryptoGraphQLService.SubscribeOnPriceChange(OnPriceChange);
		AssetCollection.CollectionChanged += HandleAssetCollectionChanged;

		dispatchertimer = dispatcher.CreateTimer();
		dispatchertimer.IsRepeating = false;
		dispatchertimer.Interval = TimeSpan.FromMilliseconds(800);
		dispatchertimer.Tick += HandleTimerTick;
	}

	public IReadOnlyList<ObservableCryptoModel> FilteredAssetList => string.IsNullOrWhiteSpace(FilterText)
																		? AssetCollection
																		: AssetCollection.Where(x => x.Name.Contains(FilterText)
																									|| x.Symbol.Contains(FilterText)).ToList();

	void HandleAssetCollectionChanged(object? sender, NotifyCollectionChangedEventArgs e) => OnPropertyChanged(nameof(FilteredAssetList));

	partial void OnFilterTextChanged(string value)
	{
		if (!dispatchertimer.IsRunning)
			dispatchertimer.Start();
	}

	void HandleTimerTick(object? sender, EventArgs e)
	{
		dispatchertimer.Stop();
		OnPropertyChanged(nameof(FilteredAssetList));
	}
}