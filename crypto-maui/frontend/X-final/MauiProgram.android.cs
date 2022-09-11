namespace MauiCrypto;

public static partial class MauiProgram
{
	const string androidDebugHost = "10.0.2.2";

	private static partial Uri GetGraphQLUri(in Uri uri)
	{
#if DEBUG
		return new UriBuilder(Uri.UriSchemeHttp, androidDebugHost, uri.Port, uri.PathAndQuery).Uri;
#else
		return new UriBuilder(Uri.UriSchemeHttps, url.Host, uri.Port, uri.PathAndQuery).Uri;
#endif
	}

	private static partial Uri GetGraphQLStreamingUri(in Uri uri)
	{
#if DEBUG
		return new UriBuilder(Uri.UriSchemeWs, androidDebugHost, uri.Port, uri.PathAndQuery).Uri;
#else
		return new UriBuilder(Uri.UriSchemeWs, url.Host, uri.Port, uri.PathAndQuery).Uri;
#endif
	}

	private static partial HttpMessageHandler GetHttpMessageHandler()
	{
#if DEBUG
		return new HttpClientHandler { AutomaticDecompression = GetDecompressionMethods() };
#else
		return new Xamarin.Android.Net.AndroidMessageHandler { AutomaticDecompression = GetDecompressionMethods() };
#endif
	}
}

