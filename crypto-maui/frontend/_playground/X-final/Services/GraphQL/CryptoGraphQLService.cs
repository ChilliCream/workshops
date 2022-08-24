using System;
using System.Runtime.CompilerServices;
using StrawberryShake;

namespace MauiCrypto;

class CryptoGraphQLService
{
	readonly MauiCryptoClient _cryptoClient;

	public CryptoGraphQLService(MauiCryptoClient client)
	{
		_cryptoClient = client;
	}

	public async IAsyncEnumerable<IGetAssestsQuery_Assets_Nodes> GetAssestsQuery([EnumeratorCancellation] CancellationToken token)
	{
		string? endCursor = null;
		IGetAssestsQueryResult? queryResult = null;

		do
		{
			var result = await _cryptoClient.GetAssestsQuery.ExecuteAsync(endCursor, token).ConfigureAwait(false);
			result.EnsureNoErrors();

			queryResult = result.Data;

			foreach (var node in queryResult?.Assets?.Nodes ?? Array.Empty<IGetAssestsQuery_Assets_Nodes>())
			{
				yield return node;
			}

			endCursor = queryResult?.Assets?.PageInfo?.EndCursor;

		} while (queryResult?.Assets?.PageInfo?.HasNextPage is true);
	}
}