using System.Collections;
using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using StrawberryShake;

namespace MauiCrypto;

[INotifyPropertyChanged]
abstract partial class BaseViewModel : IDisposable
{
	bool _disposedValue;

	~BaseViewModel() => Dispose(disposing: false);

	protected static ObservableCollection<ObservableCryptoModel> AssetCollection { get; } = new();
	protected static IDisposable? SubscribeOnPriceChangeSession { get; set; }

	public void Dispose()
	{
		Dispose(disposing: true);
		GC.SuppressFinalize(this);
	}

	protected static void OnPriceChange(IOperationResult<ISubscribeOnPriceChangeResult> result)
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
}

static class ViewModelExtensions
{
	public static bool IsNullOrEmpty(this IEnumerable? enumerable) => !enumerable?.GetEnumerator().MoveNext() ?? true;
}