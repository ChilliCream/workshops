using System.Collections.Specialized;
using CommunityToolkit.Mvvm.ComponentModel;

namespace MauiCrypto;

partial class ScreenerViewModel : BaseViewModel
{
	public ScreenerViewModel(IDispatcher dispatcher, CryptoGraphQLService cryptoGraphQLService) : base(dispatcher)
	{
	}
}