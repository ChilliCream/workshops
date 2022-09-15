using CommunityToolkit.Mvvm.ComponentModel;

namespace MauiCrypto;

partial class AssetChartViewModel : BaseViewModel, IQueryAttributable
{
	[ObservableProperty]
	string _assetImageUrl = string.Empty,
			_assetName = string.Empty,
			_assetSymbol = string.Empty;

	public AssetChartViewModel(IDispatcher dispatcher) : base(dispatcher)
	{

	}

	void IQueryAttributable.ApplyQueryAttributes(IDictionary<string, object> query)
	{
		var assetName = (string)query[nameof(AssetName)];
		var assetSymbol = (string)query[nameof(AssetSymbol)];
		var assetImageUrl = (string)query[nameof(AssetImageUrl)];

		AssetName = assetName;
		AssetSymbol = assetSymbol;
		AssetImageUrl = assetImageUrl;
	}
}

