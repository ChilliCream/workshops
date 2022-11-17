using CommunityToolkit.Maui.Markup;
using Syncfusion.Maui.Charts;

namespace MauiCrypto;

public class PriceHistoryChartView : SfCartesianChart
{
	public PriceHistoryChartView(bool areAxisVisible)
	{
		SelectionBehavior = new SeriesSelectionBehavior();
		TooltipBehavior = new ChartTooltipBehavior();
		ZoomPanBehavior = new ChartZoomPanBehavior()
		{
			EnablePanning = true,
			EnableDoubleTap = true,
			EnablePinchZooming = true,
		};

		XAxes.Add(new DateTimeAxis
		{
			IsVisible = areAxisVisible,
			LabelStyle = new ChartAxisLabelStyle()
							.Bind(ChartAxisLabelStyle.LabelFormatProperty, nameof(ICryptoChartModel.XAxisLabelStringFormat)),
			ShowMajorGridLines = false,
			ShowMinorGridLines = false
		});

		YAxes.Add(new NumericalAxis
		{
			IsVisible = areAxisVisible,
			LabelStyle = new ChartAxisLabelStyle { LabelFormat = "C2" },
			ShowMajorGridLines = false,
			ShowMinorGridLines = false,
		});

		Series.Add(new LineSeries
		{
			EnableTooltip = true,
			XBindingPath = nameof(CryptoPriceHistoryModel.LocalDateTime),
			YBindingPath = nameof(CryptoPriceHistoryModel.Price),
		}.Bind(LineSeries.ItemsSourceProperty, nameof(ICryptoChartModel.PriceHistory))
		 .Bind(LineSeries.FillProperty, nameof(ICryptoChartModel.ChartLineColor), convert: static (string? colorHex) => new SolidColorBrush(Color.FromArgb(colorHex))));
	}

	protected override void OnBindingContextChanged()
	{
		base.OnBindingContextChanged();

		if (BindingContext is not null and not ICryptoChartModel)
			throw new InvalidOperationException($"{nameof(BindingContext)} must implement {nameof(ICryptoChartModel)}");
	}
}