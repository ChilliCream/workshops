using System;
using System.Runtime.CompilerServices;
using StrawberryShake;
using StrawberryShake.Extensions;

namespace MauiCrypto;

class CryptoGraphQLService
{
	readonly MauiCryptoClient _cryptoClient;

	public CryptoGraphQLService(MauiCryptoClient client)
	{
		_cryptoClient = client;
	}

	public IDisposable? SubscribeOnPriceChange(Action<IOperationResult<ISubscribeOnPriceChangeResult>> onSubscribe)
	{
		return null;
	}

	public async IAsyncEnumerable<IGetAssestsQuery_Assets_Nodes?> GetAssestsQuery([EnumeratorCancellation] CancellationToken token)
	{
		yield return null;
	}

	public async IAsyncEnumerable<IGetAssetPriceHistoryQuery_AssetBySymbol_Price_Change_History_Nodes?> GetPriceHistory(string symbol, [EnumeratorCancellation] CancellationToken token, ChangeSpan span = ChangeSpan.Day)
	{
		yield return null;
	}
}