using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Net;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using StrawberryShake;

namespace MauiCrypto;

partial class AssetChartViewModel : BaseViewModel, IQueryAttributable, ICryptoChartViewModel
{
	readonly CryptoGraphQLService _cryptoGraphQLService;

	[ObservableProperty]
	string _assetName = string.Empty, _assetImageUrl = string.Empty;

	[ObservableProperty, NotifyPropertyChangedFor(nameof(ChartLineColor))]
	string _assetColor = string.Empty;

	[ObservableProperty, NotifyPropertyChangedFor(nameof(LastestPriceChangeText)), NotifyPropertyChangedFor(nameof(LastestPriceChangeTextColor))]
	string _assetSymbol = string.Empty;

	[ObservableProperty, NotifyPropertyChangedFor(nameof(XAxisLabelStringFormat))]
	ChangeSpan _changeSpan = ChangeSpan.Day;

	[ObservableProperty]
	DateTimeOffset _minDateTime, _maxDateTime;

	[ObservableProperty]
	double _xAxisInterval, _yAxisInterval;

	public AssetChartViewModel(IDispatcher dispatcher, CryptoGraphQLService cryptoGraphQLService) : base(dispatcher)
	{
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
		ChangeSpan.All => "MM YYYY",
		ChangeSpan.Year or ChangeSpan.Month => "MMM DD",
		ChangeSpan.Week => "DD",
		ChangeSpan.Day or ChangeSpan.Hour => "h:mm tt",
		_ => throw new NotSupportedException($"{nameof(ChangeSpan)} {ChangeSpan} not supported")
	};

	public ObservableCollection<CryptoPriceHistoryModel> PriceHistory { get; } = new();

	IReadOnlyList<CryptoPriceHistoryModel> ICryptoChartViewModel.PriceHistory => PriceHistory.ToList();

	[RelayCommand]
	async Task UpdatePriceHistory(CancellationToken token)
	{
		PriceHistory.Clear();

		try
		{
			await foreach (var node in _cryptoGraphQLService.GetPriceHistory(AssetSymbol, token, ChangeSpan).ConfigureAwait(false))
			{
				Dispatcher.Dispatch(() => PriceHistory.Add(new CryptoPriceHistoryModel(node)));
			}
		}
		catch (Exception e) when (e is HttpRequestException or WebException or GraphQLClientException)
		{
#if DEBUG
			OnHttpClientError(e.Message + "\nDisplaying Genrated Data");

			Dispatcher.Dispatch(() =>
			{
				for (int i = 0; i < 12 * 24; i++)
				{
					PriceHistory.Add(new CryptoPriceHistoryModel(DateTimeOffset.Now.Subtract(TimeSpan.FromHours(i)), Random.Shared.Next(8, 15)));
				}
			});
#else
			OnHttpClientError(e.Message);
#endif
		}
	}

	void HandleAssetCollectionChanged(object? sender, NotifyCollectionChangedEventArgs e) =>
		OnPropertyChanged(nameof(LastestPriceChangeText));

	void HandlePriceHistoryChanged(object? sender, NotifyCollectionChangedEventArgs e) =>
		OnPropertyChanged(nameof(CurrentPrice));

	async partial void OnChangeSpanChanged(ChangeSpan value)
	{
		var cts = new CancellationTokenSource(TimeSpan.FromSeconds(15));
		await UpdatePriceHistory(cts.Token);
	}

	void IQueryAttributable.ApplyQueryAttributes(IDictionary<string, object> query)
	{
		var assetName = (string)query[nameof(AssetName)];
		var assetColor = (string)query[nameof(AssetColor)];
		var assetSymbol = (string)query[nameof(AssetSymbol)];
		var assetImageUrl = (string)query[nameof(AssetImageUrl)];

		AssetName = assetName;
		AssetColor = assetColor;
		AssetSymbol = assetSymbol;
		AssetImageUrl = assetImageUrl;
	}
}

