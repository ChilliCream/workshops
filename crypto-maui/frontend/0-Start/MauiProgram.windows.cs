﻿namespace MauiCrypto;

public static partial class MauiProgram
{
	private static partial Uri GetGraphQLUri(in Uri uri)
	{
#if DEBUG
		return new UriBuilder(Uri.UriSchemeHttp, uri.Host, uri.Port, uri.PathAndQuery).Uri;
#else
		return new UriBuilder(Uri.UriSchemeHttps, uri.Host, uri.Port, uri.PathAndQuery).Uri;
#endif
	}

	private static partial Uri GetGraphQLStreamingUri(in Uri uri) => new UriBuilder(Uri.UriSchemeWs, uri.Host, uri.Port, uri.PathAndQuery).Uri;

	private static partial HttpMessageHandler GetHttpMessageHandler() => new HttpClientHandler { AutomaticDecompression = GetDecompressionMethods() };
}