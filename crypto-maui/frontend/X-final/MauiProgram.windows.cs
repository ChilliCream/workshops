﻿namespace MauiCrypto;

public static partial class MauiProgram
{
	static MauiProgram()
	{
#if DEBUG
		_apiUrl = "https://localhost:5100/graphql/";
#else
#error GraphQL API Not Defined
		_apiUrl = "";
#endif
	}

	static HttpMessageHandler GetHttpMessageHandler() => new HttpClientHandler { AutomaticDecompression = GetDecompressionMethods() };
}

