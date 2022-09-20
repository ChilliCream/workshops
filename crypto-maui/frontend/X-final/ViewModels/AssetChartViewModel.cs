using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Net;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Java.Net;
using StrawberryShake;

namespace MauiCrypto;

partial class AssetChartViewModel : BaseViewModel, IQueryAttributable, ICryptoChartViewModel
{
	readonly IBrowser _browser;
	readonly CryptoGraphQLService _cryptoGraphQLService;

	CancellationTokenSource _changeSpanUpdatedTCS = new();

	[ObservableProperty]
	string _assetName = string.Empty,
		_assetImageUrl = string.Empty,
		_assetDescription = string.Empty;

	[ObservableProperty]
	string? _website, _whitePaper;

	[ObservableProperty, NotifyPropertyChangedFor(nameof(ChartLineColor))]
	string _assetColor = string.Empty;

	[ObservableProperty, NotifyPropertyChangedFor(nameof(LastestPriceChangeText)), NotifyPropertyChangedFor(nameof(LastestPriceChangeTextColor))]
	string _assetSymbol = string.Empty;

	[ObservableProperty, NotifyPropertyChangedFor(nameof(XAxisLabelStringFormat))]
	ChangeSpan _changeSpan = ChangeSpan.Day;

	[ObservableProperty]
	DateTimeOffset _minDateTime, _maxDateTime;

	[ObservableProperty]
	double _xAxisInterval, _yAxisInterval, _lastPrice, _marketCap, _volume24Hour,
		_circulatingSupply, _maxSupply, _tradingActivity, _change24Hour, _tradableMarketCapRank;

	public AssetChartViewModel(IBrowser browser, IDispatcher dispatcher, CryptoGraphQLService cryptoGraphQLService) : base(dispatcher)
	{
		_browser = browser;
		_cryptoGraphQLService = cryptoGraphQLService;

		PriceHistory.CollectionChanged += HandlePriceHistoryChanged;
		AssetCollection.CollectionChanged += HandleAssetCollectionChanged;
	}

	public double CurrentPrice => PriceHistory.MaxBy(x => x.LocalDateTime)?.Price ?? 0;
	public string LastestPriceChangeText => AssetCollection.FirstOrDefault(x => x.Symbol == AssetSymbol)?.PercentChangeText ?? string.Empty;
	public Color LastestPriceChangeTextColor => AssetCollection.FirstOrDefault(x => x.Symbol == AssetSymbol)?.PercentChangeTextColor ?? Colors.Transparent;

	public string ChartLineColor => AssetColor;

	public string XAxisLabelStringFormat => ChangeSpan switch
	{
		ChangeSpan.All => "MM yyyy",
		ChangeSpan.Year or ChangeSpan.Month or ChangeSpan.Week => "MMM dd",
		ChangeSpan.Day or ChangeSpan.Hour => "h:mm tt",
		_ => throw new NotSupportedException($"{nameof(ChangeSpan)} {ChangeSpan} not supported")
	};

	public ObservableCollection<CryptoPriceHistoryModel> PriceHistory { get; } = new();

	IReadOnlyList<CryptoPriceHistoryModel> ICryptoChartViewModel.PriceHistory => PriceHistory.ToList();

	bool IsWebsiteLinkValid() => Website is not null;
	bool IsWhitepaperLinkValid() => WhitePaper is not null;

	[RelayCommand(CanExecute = nameof(IsWebsiteLinkValid))]
	Task OpenWebsite(string url) => Dispatcher.DispatchAsync(() => _browser.OpenAsync(url));

	[RelayCommand(CanExecute = nameof(IsWhitepaperLinkValid))]
	Task OpenWhitePaper(string url) => Dispatcher.DispatchAsync(() => _browser.OpenAsync(url));

	[RelayCommand]
	void UpdateChangeSpan(ChangeSpan span) => ChangeSpan = span;

	[RelayCommand]
	async Task UpdatePriceHistory(CancellationToken token)
	{
		var combinedTCS = CancellationTokenSource.CreateLinkedTokenSource(token, _changeSpanUpdatedTCS.Token);

		await Dispatcher.DispatchAsync(() => PriceHistory.Clear()).ConfigureAwait(false);

		try
		{
			await foreach (var node in _cryptoGraphQLService.GetPriceHistory(AssetSymbol, combinedTCS.Token, ChangeSpan).ConfigureAwait(false))
			{
				Dispatcher.Dispatch(() => PriceHistory.Add(new CryptoPriceHistoryModel(node)));
			}
		}
		catch (TaskCanceledException)
		{

		}
		catch (Exception e) when (e is HttpRequestException or WebException or GraphQLClientException)
		{
			if (!combinedTCS.Token.IsCancellationRequested)
				OnHttpClientError(e.Message);
		}
#if ANDROID
		catch (ArgumentNullException)
		{

		}
#endif
	}

	void HandleAssetCollectionChanged(object? sender, NotifyCollectionChangedEventArgs e) =>
		OnPropertyChanged(nameof(LastestPriceChangeText));

	void HandlePriceHistoryChanged(object? sender, NotifyCollectionChangedEventArgs e) =>
		OnPropertyChanged(nameof(CurrentPrice));

	async partial void OnChangeSpanChanged(ChangeSpan value)
	{
		_changeSpanUpdatedTCS?.Cancel();

		_changeSpanUpdatedTCS = new CancellationTokenSource(TimeSpan.FromSeconds(15));
		await UpdatePriceHistory(_changeSpanUpdatedTCS.Token);
	}

	void IQueryAttributable.ApplyQueryAttributes(IDictionary<string, object> query)
	{
		var website = (string?)query[nameof(Website)];
		var assetName = (string)query[nameof(AssetName)];
		var assetColor = (string)query[nameof(AssetColor)];
		var whitePaper = (string?)query[nameof(WhitePaper)];
		var assetSymbol = (string)query[nameof(AssetSymbol)];
		var assetImageUrl = (string)query[nameof(AssetImageUrl)];
		var assetDescription = (string)query[nameof(AssetDescription)];

		var lastPrice = (double)query[nameof(AssetChartViewModel.LastPrice)];
		var marketCap = (double)query[nameof(AssetChartViewModel.MarketCap)];
		var maxSupply = (double)query[nameof(AssetChartViewModel.MaxSupply)];
		var change24Hour = (double)query[nameof(AssetChartViewModel.Change24Hour)];
		var volume24Hour = (double)query[nameof(AssetChartViewModel.Volume24Hour)];
		var tradingActivity = (double)query[nameof(AssetChartViewModel.TradingActivity)];
		var circulatingSupply = (double)query[nameof(AssetChartViewModel.CirculatingSupply)];
		var tradableMarketCapRank = (double)query[nameof(AssetChartViewModel.TradableMarketCapRank)];

		Website = website;
		AssetName = assetName;
		LastPrice = lastPrice;
		MarketCap = marketCap;
		MaxSupply = maxSupply;
		WhitePaper = whitePaper;
		AssetColor = assetColor;
		AssetSymbol = assetSymbol;
		Change24Hour = change24Hour;
		Volume24Hour = volume24Hour;
		AssetImageUrl = assetImageUrl;
		TradingActivity = tradingActivity;
		AssetDescription = assetDescription;
		CirculatingSupply = circulatingSupply;
		TradableMarketCapRank = tradableMarketCapRank;
	}
}

