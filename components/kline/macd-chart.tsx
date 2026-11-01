"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType, HistogramSeries, LineSeries } from "lightweight-charts";
import { toChartTime } from "@/lib/utils";

interface MacdChartProps {
  dates: string[];
  dif: (number | null)[];
  dea: (number | null)[];
  macd: (number | null)[];
  height?: number;
  period?: string;
}

export default function MacdChart({ dates, dif, dea, macd, height = 150, period }: MacdChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || dates.length === 0) return;

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
      timeScale: { borderColor: "#2f3542", visible: false },
      rightPriceScale: { borderColor: "#2f3542" },
    });

    const macdSeries = chart.addSeries(HistogramSeries, {
      priceLineVisible: false,
      lastValueVisible: false,
    });
    const macdData = macd
      .map((v, i) => ({
        time: toChartTime(dates[i], period),
        value: v,
        color: v !== null && v >= 0 ? "rgba(239,68,68,0.6)" : "rgba(34,197,94,0.6)",
      }))
      .filter((d) => d.value !== null);
    macdSeries.setData(macdData as any);

    const difSeries = chart.addSeries(LineSeries, {
      color: "#3b82f6",
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    difSeries.setData(
      dif.map((v, i) => ({ time: toChartTime(dates[i], period), value: v })).filter((d) => d.value !== null) as any
    );

    const deaSeries = chart.addSeries(LineSeries, {
      color: "#f59e0b",
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    deaSeries.setData(
      dea.map((v, i) => ({ time: toChartTime(dates[i], period), value: v })).filter((d) => d.value !== null) as any
    );

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
  }, [dates, dif, dea, macd, height, period]);

  return (
    <div>
      <p className="text-xs text-muted mb-1 px-1">MACD</p>
      <div ref={containerRef} className="w-full" />
    </div>
  );
}
