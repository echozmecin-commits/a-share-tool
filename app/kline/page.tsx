"use client";

import { useState, useEffect, useCallback } from "react";
import StockSearch from "@/components/kline/stock-search";
import KlineChart from "@/components/kline/kline-chart";
import MacdChart from "@/components/kline/macd-chart";
import IndicatorPanel from "@/components/kline/indicator-panel";
import type { KlineData, Period } from "@/lib/types";
import { cn } from "@/lib/utils";

const PERIODS: { value: Period; label: string }[] = [
  { value: "5", label: "5分" },
  { value: "15", label: "15分" },
  { value: "30", label: "30分" },
  { value: "60", label: "60分" },
  { value: "daily", label: "日K" },
  { value: "weekly", label: "周K" },
  { value: "monthly", label: "月K" },
];

export default function KlinePage() {
  const [symbol, setSymbol] = useState("600519");
  const [name, setName] = useState("贵州茅台");
  const [period, setPeriod] = useState<Period>("daily");
  const [klineData, setKlineData] = useState<KlineData[]>([]);
  const [indicators, setIndicators] = useState<Record<string, (number | null)[]>>({});
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(["ma5", "ma10", "ma20", "macd"]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [klineRes, indicatorRes] = await Promise.all([
        fetch(`/api/stock/kline?symbol=${symbol}&period=${period}`),
        fetch(
          `/api/stock/indicators?symbol=${symbol}&period=${period}&indicators=${selectedIndicators.join(",")}`
        ),
      ]);

      if (klineRes.ok) {
        const kline = await klineRes.json();
        setKlineData(kline);
      }
      if (indicatorRes.ok) {
        const indData = await indicatorRes.json();
        setIndicators(indData);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, [symbol, period, selectedIndicators]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function handleSelectStock(sym: string, stockName: string) {
    setSymbol(sym);
    setName(stockName);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <StockSearch
            onSelect={handleSelectStock}
            currentSymbol={symbol}
            currentName={name}
          />
          <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={cn(
                  "px-3 py-1 rounded text-xs transition-colors",
                  period === p.value
                    ? "bg-accent text-white"
                    : "text-muted hover:text-foreground"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="text-sm">
          <span className="text-foreground font-medium">{name}</span>
          <span className="text-muted ml-2">{symbol}</span>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 space-y-1">
          {loading && klineData.length === 0 ? (
            <div className="bg-card border border-border rounded-lg h-[500px] flex items-center justify-center text-muted">
              加载中...
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <KlineChart data={klineData} indicators={indicators} />
            </div>
          )}

          {selectedIndicators.includes("macd") && indicators.dif && (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <MacdChart
                dates={(indicators.date as unknown as string[]) || []}
                dif={indicators.dif}
                dea={indicators.dea || []}
                macd={indicators.macd || []}
              />
            </div>
          )}
        </div>

        <div className="w-48 shrink-0">
          <IndicatorPanel
            selected={selectedIndicators}
            onChange={setSelectedIndicators}
          />
        </div>
      </div>
    </div>
  );
}
