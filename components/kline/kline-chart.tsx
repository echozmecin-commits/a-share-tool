"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType, CandlestickSeries, HistogramSeries, LineSeries } from "lightweight-charts";
import type { KlineData } from "@/lib/types";
import { toChartTime } from "@/lib/utils";

interface KlineChartProps {
  data: KlineData[];
  indicators?: Record<string, (number | null)[]>;
  height?: number;
  period?: string;
}

const MA_COLORS: Record<string, string> = {
  ma5: "#f59e0b",
  ma10: "#3b82f6",
  ma20: "#ef4444",
  ma60: "#22c55e",
  ma120: "#a855f7",
  ma250: "#ec4899",
};

export default function KlineChart({ data, indicators, height = 500, period }: KlineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#1a1f2e" },
        textColor: "#71767b",
      },
      grid: {
        vertLines: { color: "#2f3542" },
        horzLines: { color: "#2f3542" },
      },
      width: containerRef.current.clientWidth,
      height,
      crosshair: {
        mode: 0,
      },
      timeScale: {
        borderColor: "#2f3542",
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: "#2f3542",
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#ef4444",
      downColor: "#22c55e",
      borderUpColor: "#ef4444",
      borderDownColor: "#22c55e",
      wickUpColor: "#ef4444",
      wickDownColor: "#22c55e",
    });

    const candleData = data.map((d) => ({
      time: toChartTime(d.date, period),
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));
    candleSeries.setData(candleData as any);

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });

    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    const volumeData = data.map((d) => ({
      time: toChartTime(d.date, period),
      value: d.volume,
      color: d.close >= d.open ? "rgba(239,68,68,0.4)" : "rgba(34,197,94,0.4)",
    }));
    volumeSeries.setData(volumeData as any);

    if (indicators) {
      const dates = indicators.date as unknown as string[];

      Object.entries(MA_COLORS).forEach(([key, color]) => {
        if (indicators[key]) {
          const maSeries = chart.addSeries(LineSeries, {
            color,
            lineWidth: 1,
            priceLineVisible: false,
            lastValueVisible: false,
          });
          const maData = (indicators[key] as (number | null)[])
            .map((v, i) => ({
              time: toChartTime(dates[i], period),
              value: v,
            }))
            .filter((d) => d.value !== null);
          maSeries.setData(maData as any);
        }
      });

      if (indicators.boll_upper && indicators.boll_mid && indicators.boll_lower) {
        const bollColors = { boll_upper: "#a855f7", boll_mid: "#f59e0b", boll_lower: "#a855f7" };
        Object.entries(bollColors).forEach(([key, color]) => {
          const series = chart.addSeries(LineSeries, {
            color,
            lineWidth: 1,
            lineStyle: key !== "boll_mid" ? 2 : 0,
            priceLineVisible: false,
            lastValueVisible: false,
          });
          const lineData = (indicators[key] as (number | null)[])
            .map((v, i) => ({ time: toChartTime(dates[i], period), value: v }))
            .filter((d) => d.value !== null);
          series.setData(lineData as any);
        });
      }
    }

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, indicators, height, period]);

  return <div ref={containerRef} className="w-full" />;
}
