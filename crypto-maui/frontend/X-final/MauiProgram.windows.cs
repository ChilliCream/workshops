namespace MauiCrypto;

public static partial class MauiProgram
{
	static MauiProgram()
	{
#if DEBUG
		_apiUrl = "http://localhost:5100/graphql/";
#else
#error GraphQL API Not Defined
		_apiUrl = "";
#endif
	}

	private static partial HttpMessageHandler GetHttpMessageHandler() => new HttpClientHandler { AutomaticDecompression = GetDecompressionMethods() };
}

