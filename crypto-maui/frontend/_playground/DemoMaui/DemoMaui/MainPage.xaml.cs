#nullable enable

using System.Collections.ObjectModel;
using System.Reactive.Linq;
using DemoMaui.GraphQL;
using StrawberryShake;

namespace DemoMaui;

public partial class MainPage : ContentPage
{
    private readonly GetAssetsQuery _getAssetsQuery;
    private IDisposable? _session;
    private string? _afterCursor;
    
    public ObservableCollection<IAssetInfo> AssetInfos { get; } = new();

    public MainPage(GetAssetsQuery getAssetsQuery, OnPriceChangeSubscription onPriceChange)
    {
        _getAssetsQuery = getAssetsQuery;
        
        InitializeComponent();

        BindingContext = this;
        _session = CreateGetAssetQuery();

        onPriceChange.Watch().Subscribe(_ => { });
    }
    
    private void Button_OnClicked(object? sender, EventArgs e)
    {
        CreateGetAssetQuery(_afterCursor);
    }

    private IDisposable CreateGetAssetQuery(string? after = null)
    {
        _session?.Dispose();
        
        return _getAssetsQuery
            .Watch(after, ExecutionStrategy.CacheAndNetwork)
            .Where(r => r.IsSuccessResult())
            .Select(r => r.Data?.Assets)
            .Where(r => r is not null)
            .Subscribe(
                r =>
                {
                    AssetInfos.Clear();
                    
                    foreach (var asset in r!.Nodes!)
                    {
                        AssetInfos.Add(asset);
                    }

                    _afterCursor = r.PageInfo.EndCursor;
                });
    }


    private void ItemsView_OnRemainingItemsThresholdReached(object? sender, EventArgs e)
    {
        /*
        _session?.Dispose();
        _session = _getAssetsQuery
            .Watch(_afterCursor, ExecutionStrategy.CacheAndNetwork)
            .Where(r => r.IsSuccessResult())
            .Select(r => r.Data?.Assets)
            .Where(r => r is not null)
            .Subscribe(
                r =>
                {
                    foreach (var asset in r!.Nodes!)
                    {
                        AssetInfos.Add(asset);
                    }

                    _afterCursor = r.PageInfo.EndCursor;
                });
                */
    }
}