﻿using CommunityToolkit.Maui.Markup;
using Syncfusion.Maui.Charts;

namespace MauiCrypto;

public class PriceHistoryChartView : SfCartesianChart
{
	public PriceHistoryChartView()
	{
		SelectionBehavior = new ChartSelectionBehavior();
		TooltipBehavior = new ChartTooltipBehavior();
		ZoomPanBehavior = new ChartZoomPanBehavior()
		{
			EnablePanning = true,
			EnableDoubleTap = true,
			EnablePinchZooming = true,
		};

		XAxes.Add(new DateTimeAxis
		{
			LabelStyle = new ChartAxisLabelStyle()
							.Bind(ChartAxisLabelStyle.LabelFormatProperty, nameof(ICryptoChartViewModel.XAxisLabelStringFormat)),
			ShowMajorGridLines = false,
			ShowMinorGridLines = false
		});

		YAxes.Add(new NumericalAxis
		{
			LabelStyle = new ChartAxisLabelStyle { LabelFormat = "C2" },
			ShowMajorGridLines = false,
			ShowMinorGridLines = false,
		});

		Series.Add(new LineSeries
		{
			EnableTooltip = true,
			XBindingPath = nameof(CryptoPriceHistoryModel.LocalDateTime),
			YBindingPath = nameof(CryptoPriceHistoryModel.Price),
		}.Bind(LineSeries.ItemsSourceProperty, nameof(ICryptoChartViewModel.PriceHistory))
		 .Bind(LineSeries.FillProperty, nameof(ICryptoChartViewModel.ChartLineColor), convert: static (string? colorHex) => new SolidColorBrush(Color.FromArgb(colorHex))));
	}

	protected override void OnBindingContextChanged()
	{
		base.OnBindingContextChanged();

		if (BindingContext is not ICryptoChartViewModel)
			throw new InvalidOperationException($"{nameof(BindingContext)} must implement {nameof(ICryptoChartViewModel)}");
	}
}

