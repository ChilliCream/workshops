using Syncfusion.Maui.Charts;

namespace MauiCrypto;

public class PriceHistoryChartView : SfCartesianChart
{
	public PriceHistoryChartView()
	{
		Margin = 0;

		BackgroundColor = Colors.Green;

		TooltipBehavior = new ChartTooltipBehavior();
		ZoomPanBehavior = new ChartZoomPanBehavior()
		{
			EnablePanning = true,
			EnableDoubleTap = true,
			EnablePinchZooming = true,
		};

		XAxes.Add(new DateTimeAxis());

		YAxes.Add(new NumericalAxis());

		var lineSeries = new LineSeries
		{
			EnableTooltip = true,
			XBindingPath = nameof(CryptoPriceHistoryModel.LocalDateTime),
			YBindingPath = nameof(CryptoPriceHistoryModel.Price)
		};
		lineSeries.SetBinding(LineSeries.ItemsSourceProperty, nameof(ICryptoChartViewModel.PriceHistory));

		Series.Add(lineSeries);
	}

	protected override void OnBindingContextChanged()
	{
		base.OnBindingContextChanged();

		if (BindingContext is not ICryptoChartViewModel)
			throw new InvalidOperationException($"{nameof(BindingContext)} must implement {nameof(ICryptoChartViewModel)}");
	}
}

