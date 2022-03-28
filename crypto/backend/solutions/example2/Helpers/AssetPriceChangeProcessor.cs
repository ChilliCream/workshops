using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Demo.Data;
using Demo.Types.Assets;

namespace Demo.Helpers;

public sealed class AssetPriceChangeProcessor : IHostedService, IDisposable
{
    private readonly CancellationTokenSource _cts = new();
    private readonly IDbContextFactory<AssetContext> _contextFactory;
    private bool _disposed;

    public AssetPriceChangeProcessor(IDbContextFactory<AssetContext> contextFactory)
    {
        _contextFactory = contextFactory;
    }

    public async Task StartAsync(CancellationToken stoppingToken)
    {
        using AssetContext context = await _contextFactory.CreateDbContextAsync(stoppingToken);
        await context.Database.EnsureCreatedAsync(stoppingToken);

        BeginUpdatePrices();
    }

    public Task StopAsync(CancellationToken stoppingToken)
    {
        _cts.Cancel();
        return Task.CompletedTask;
    }

    private void BeginUpdatePrices()
        => Task.Factory.StartNew(
            () => UpdatePricesAsync(_cts.Token),
            _cts.Token,
            TaskCreationOptions.LongRunning,
            TaskScheduler.Default);

    private async Task UpdatePricesAsync(CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            try
            {
                using var client = new HttpClient();
                using var context = await _contextFactory.CreateDbContextAsync(cancellationToken);

                client.BaseAddress = new("https://ccc-workshop-eu-functions.azurewebsites.net");

                var assets = await context.Assets.Select(t => new { t.Id, t.Symbol }).ToDictionaryAsync(t => t.Symbol!, t => t.Id, cancellationToken);
                if (assets.Count > 0)
                {
                    var prices = await context.AssetPrices.Where(t => assets.Keys.Contains(t.Symbol!)).ToDictionaryAsync(t => t.Symbol!, cancellationToken);
                    var updates = await LoadCurrentAssetPricesAsync(assets.Keys, client, cancellationToken);

                    foreach (var update in updates)
                    {
                        prices.TryGetValue(update.Symbol, out var price);
                        await UpdateAssetPriceAsync(price, update, assets[update.Symbol], context, cancellationToken);
                    }
                }
            }
            catch
            {
                // if there is an error we will retry
            }

            await Task.Delay(Random.Shared.Next(10_000, 20_000), cancellationToken);
        }
    }

    private static async Task<IReadOnlyList<UpdateAssetPriceInput>> LoadCurrentAssetPricesAsync(
        IReadOnlyCollection<string> keys,
        HttpClient client,
        CancellationToken cancellationToken)
    {
        using var priceRequest = new HttpRequestMessage(
            HttpMethod.Get,
            $"api/asset/price?symbols={string.Join(",", keys)}");

        using var changeRequest = new HttpRequestMessage(
            HttpMethod.Get,
            $"api/asset/price/change?symbols={string.Join(",", keys)}&span=Day");

        using var priceResponse = await client.SendAsync(priceRequest, cancellationToken);
        priceResponse.EnsureSuccessStatusCode();

        using var changeResponse = await client.SendAsync(changeRequest, cancellationToken);
        changeResponse.EnsureSuccessStatusCode();

        var priceContent = await priceResponse.Content.ReadAsByteArrayAsync(cancellationToken);
        var changeContent = await changeResponse.Content.ReadAsByteArrayAsync(cancellationToken);

        var priceDoc = JsonDocument.Parse(priceContent);
        var changeDoc = JsonDocument.Parse(changeContent);

        var changeLookup = changeDoc.RootElement.EnumerateArray().ToDictionary(t => t.GetProperty("symbol").GetString()!);
        var list = new List<UpdateAssetPriceInput>();

        foreach (JsonElement priceInfo in priceDoc.RootElement.EnumerateArray())
        {
            if (changeLookup.TryGetValue(priceInfo.GetProperty("symbol").GetString()!, out var change))
            {
                list.Add(priceInfo.ToUpdateAssetPriceInput(change));
            }
        }

        return list;
    }

    private static async Task UpdateAssetPriceAsync(
        AssetPrice? price,
        UpdateAssetPriceInput input,
        int assetId,
        AssetContext context,
        CancellationToken cancellationToken)
    {
        if (price is null)
        {
            price = new AssetPrice { AssetId = assetId };
            context.AssetPrices.Add(price);
        }

        price.Change24Hour = input.Change24Hour;
        price.CirculatingSupply = input.CirculatingSupply;
        price.Currency = input.Currency;
        price.High24Hour = input.High24Hour;
        price.LastPrice = Math.Round(input.LastPrice, 2);
        price.Low24Hour = input.Low24Hour;
        price.MarketCap = input.MarketCap;
        price.MaxSupply = input.MaxSupply;
        price.Open24Hour = input.Open24Hour;
        price.TradableMarketCapRank = input.TradableMarketCapRank;
        price.Symbol = input.Symbol;
        price.TradingActivity = input.TradingActivity;
        price.Volume24Hour = input.Volume24Hour;
        price.VolumePercentChange24Hour = input.VolumePercentChange24Hour;
        price.ModifiedAt = DateTime.UtcNow;

        await context.SaveChangesAsync(cancellationToken);
    }

    public void Dispose()
    {
        if (_disposed)
        {
            if (!_cts.IsCancellationRequested)
            {
                _cts.Cancel();
            }
            _cts.Dispose();
            _disposed = true;
        }
    }
}
