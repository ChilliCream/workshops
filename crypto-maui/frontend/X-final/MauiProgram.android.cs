using System;
using Xamarin.Android.Net;

namespace MauiCrypto;

public static partial class MauiProgram
{
	static MauiProgram()
	{
#if DEBUG
		_apiUrl = "https://10.0.2.2:5100/graphql/";
#else
#error GraphQL API Not Defined
		_apiUrl = "";
#endif
	}

	static HttpMessageHandler GetHttpMessageHandler()
	{
#if DEBUG
		return new HttpClientHandler { AutomaticDecompression = GetDecompressionMethods() };
#else
		return new AndroidMessageHandler { AutomaticDecompression = GetDecompressionMethods() };
#endif
	}
}

