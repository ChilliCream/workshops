namespace MauiCrypto;

class CryptoPriceHistoryModel : IGetAssetPriceHistoryQuery_AssetBySymbol_Price_Change_History_Nodes
{
	public CryptoPriceHistoryModel(IGetAssetPriceHistoryQuery_AssetBySymbol_Price_Change_History_Nodes node)
		: this(node.Epoch, node.Price)
	{

	}

	public CryptoPriceHistoryModel(DateTimeOffset timeStamp, double price) : this(price)
	{
		TimeStamp = timeStamp;
		Epoch = timeStamp.ToUnixTimeSeconds();
	}

	public CryptoPriceHistoryModel(long epoch, double price) : this(price)
	{
		Epoch = epoch;
		TimeStamp = DateTimeOffset.UnixEpoch.AddSeconds(epoch);
	}

	CryptoPriceHistoryModel(double price)
	{
		Price = price;
	}

	public DateTime LocalDateTime => TimeStamp.LocalDateTime;

	public DateTimeOffset TimeStamp { get; }
	public double Price { get; }

	long Epoch { get; }

	int IGetAssetPriceHistoryQuery_AssetBySymbol_Price_Change_History_Nodes.Epoch => (int)this.Epoch;
}