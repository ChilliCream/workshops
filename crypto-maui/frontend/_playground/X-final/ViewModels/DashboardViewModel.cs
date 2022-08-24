using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using StrawberryShake;

namespace MauiCrypto;

partial class DashboardViewModel : BaseViewModel
{
	readonly CryptoGraphQLService _cryptoGraphQLService;

	public DashboardViewModel(CryptoGraphQLService cryptoGraphQLService)
	{
		_cryptoGraphQLService = cryptoGraphQLService;
	}

	public ObservableCollection<IGetAssestsQuery_Assets_Nodes> AssetCollection { get; } = new();

	[RelayCommand]
	async Task RefreshCollectionView(CancellationToken token)
	{
		AssetCollection.Clear();

		await foreach (var node in _cryptoGraphQLService.GetAssestsQuery(token).ConfigureAwait(false))
		{
			AssetCollection.Add(node);
		}
	}
}

