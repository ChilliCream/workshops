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

	public IDisposable SubscribeOnPriceChange(Action<IOperationResult<ISubscribeOnPriceChangeResult>> onNext) => _cryptoClient.SubscribeOnPriceChange.Watch().Subscribe(onNext);

	public async IAsyncEnumerable<IGetAssestsQuery_Assets_Nodes> GetAssestsQuery([EnumeratorCancellation] CancellationToken token)
	{
		string? endCursor = null;
		IGetAssestsQueryResult? queryResult;

		do
		{
			var result = await _cryptoClient.GetAssestsQuery.ExecuteAsync(endCursor, token).ConfigureAwait(false);
			result.EnsureNoErrors();

			queryResult = result.Data;

			foreach (var node in queryResult?.Assets?.Nodes ?? Array.Empty<IGetAssestsQuery_Assets_Nodes>())
			{
				if (node is not null)
					yield return node;
			}

			endCursor = queryResult?.Assets?.PageInfo?.EndCursor;

		} while (queryResult?.Assets?.PageInfo?.HasNextPage is true);
	}

	public async IAsyncEnumerable<IGetAssetPriceHistoryQuery_AssetBySymbol_Price_Change_History_Nodes> GetPriceHistory(string symbol, [EnumeratorCancellation] CancellationToken token, ChangeSpan span = ChangeSpan.Day)
	{
		string? endCursor = null;
		IGetAssetPriceHistoryQueryResult? queryResult;

		do
		{
			var result = await _cryptoClient.GetAssetPriceHistoryQuery.ExecuteAsync(symbol, endCursor, span, token).ConfigureAwait(false);
			result.EnsureNoErrors();

			queryResult = result.Data;

			foreach (var node in queryResult?.AssetBySymbol?.Price.Change?.History?.Nodes ?? Array.Empty<IGetAssetPriceHistoryQuery_AssetBySymbol_Price_Change_History_Nodes>())
			{
				if (node is not null)
					yield return node;
			}

			endCursor = queryResult?.AssetBySymbol?.Price?.Change?.History?.PageInfo?.EndCursor;
		}
		while (queryResult?.AssetBySymbol?.Price?.Change?.History?.PageInfo?.HasNextPage is true);
	}
}