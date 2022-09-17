using System.Collections;
using System.Collections.ObjectModel;
using System.Net;
using AsyncAwaitBestPractices;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using StrawberryShake;

namespace MauiCrypto;

[INotifyPropertyChanged]
abstract partial class BaseViewModel : IDisposable
{
	static readonly AsyncAwaitBestPractices.WeakEventManager<string> _httpClientErrorEventManager = new();

	bool _disposedValue;

	public BaseViewModel(IDispatcher dispatcher) => Dispatcher = dispatcher;

	~BaseViewModel() => Dispose(disposing: false);

	protected static ObservableCollection<ObservableCryptoModel> AssetCollection { get; } = new();
	protected static IDisposable? SubscribeOnPriceChangeSession { get; set; }

	public void Dispose()
	{
		Dispose(disposing: true);
		GC.SuppressFinalize(this);
	}

	protected IDispatcher Dispatcher { get; }

	public static event EventHandler<string> HttpClientError
	{
		add => _httpClientErrorEventManager.AddEventHandler(value);
		remove => _httpClientErrorEventManager.RemoveEventHandler(value);
	}

	protected virtual void Dispose(bool disposing)
	{
		if (!_disposedValue)
		{
			if (disposing)
			{
				SubscribeOnPriceChangeSession?.Dispose();
			}

			_disposedValue = true;
		}
	}

	protected void OnPriceChange(IOperationResult<ISubscribeOnPriceChangeResult> result)
	{
		try
		{
			result.EnsureNoErrors();

			if (result?.Data?.OnPriceChange is ISubscribeOnPriceChange_OnPriceChange_AssetPrice assetPrice
				&& AssetCollection.FirstOrDefault(x => x.Symbol == assetPrice.Symbol) is ObservableCryptoModel node
				&& assetPrice.LastPrice != node.Price?.LastPrice)
			{
				node.Price = new ObservableCryptoPriceModel
				{
					LastPrice = assetPrice.LastPrice,
					Change24Hour = assetPrice.Change24Hour
				};
			}
		}
		catch (HttpRequestException e)
		{
			OnHttpClientError(e.Message);
		}
		catch (WebException e)
		{
			OnHttpClientError(e.Message);
		}
	}

	protected async void OnHttpClientError(string message) =>
		await Dispatcher.DispatchAsync(() => _httpClientErrorEventManager.RaiseEvent(null, message, nameof(HttpClientError)));

	[RelayCommand]
	Task CollectionViewSelectionChanged(CollectionView? collectionView)
	{
		ArgumentNullException.ThrowIfNull(collectionView?.SelectedItem);

		var asset = (IGetAssestsQuery_Assets_Nodes)collectionView.SelectedItem;
		var route = AppShell.GetRoute<AssetChartPage, AssetChartViewModel>();

		var parameters = new Dictionary<string, object?>
		{
			{ nameof(AssetChartViewModel.AssetName), asset.Name },
			{ nameof(AssetChartViewModel.AssetColor), asset.Color },
			{ nameof(AssetChartViewModel.AssetSymbol), asset.Symbol },
			{ nameof(AssetChartViewModel.AssetImageUrl), asset.ImageUrl },
		};

		return Dispatcher.DispatchAsync(() =>
		{
			collectionView.SelectedItem = null;
			return Shell.Current.GoToAsync(route, parameters);
		});
	}
}

static class ViewModelExtensions
{
	public static bool IsNullOrEmpty(this IEnumerable? enumerable) => !enumerable?.GetEnumerator().MoveNext() ?? true;
}