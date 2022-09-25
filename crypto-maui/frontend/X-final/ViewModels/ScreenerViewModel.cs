using System.Collections.Specialized;
using CommunityToolkit.Mvvm.ComponentModel;

namespace MauiCrypto;

partial class ScreenerViewModel : BaseViewModel
{
	readonly IDispatcherTimer _dispatchertimer;

	[ObservableProperty]
	string _filterText = string.Empty;

	public ScreenerViewModel(IDispatcher dispatcher, CryptoGraphQLService cryptoGraphQLService) : base(dispatcher)
	{
		SubscribeOnPriceChangeSession = cryptoGraphQLService.SubscribeOnPriceChange(OnPriceChange);
		AssetCollection.CollectionChanged += HandleAssetCollectionChanged;

		_dispatchertimer = dispatcher.CreateTimer();
		_dispatchertimer.IsRepeating = false;
		_dispatchertimer.Interval = TimeSpan.FromMilliseconds(800);
		_dispatchertimer.Tick += HandleTimerTick;
	}

	public IReadOnlyList<ObservableCryptoModel> FilteredAssetList => string.IsNullOrWhiteSpace(FilterText)
																		? AssetCollection
																		: AssetCollection.Where(x => x.Name.Contains(FilterText, StringComparison.OrdinalIgnoreCase)
																									|| x.Symbol.Contains(FilterText, StringComparison.OrdinalIgnoreCase)).ToList();

	void HandleAssetCollectionChanged(object? sender, NotifyCollectionChangedEventArgs e) =>
		OnPropertyChanged(nameof(FilteredAssetList));

	partial void OnFilterTextChanged(string value)
	{
		if (!_dispatchertimer.IsRunning)
			_dispatchertimer.Start();
	}

	void HandleTimerTick(object? sender, EventArgs e)
	{
		_dispatchertimer.Stop();
		OnPropertyChanged(nameof(FilteredAssetList));
	}
}