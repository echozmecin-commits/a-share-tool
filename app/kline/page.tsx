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
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setKlineData([]);
    setIndicators({});
    try {
      const [klineRes, indicatorRes] = await Promise.all([
        fetch(`/api/stock/kline?symbol=${encodeURIComponent(symbol)}&period=${period}`),
        fetch(
          `/api/stock/indicators?symbol=${encodeURIComponent(symbol)}&period=${period}&indicators=${selectedIndicators.join(",")}`
        ),
      ]);

      if (!klineRes.ok) throw new Error(`K 线接口返回 ${klineRes.status}`);
      const kline = await klineRes.json();
      if (!Array.isArray(kline)) throw new Error("K 线数据格式异常");
      setKlineData(kline);

      if (indicatorRes.ok) {
        const indData = await indicatorRes.json();
        setIndicators(indData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败，请检查 Python 数据服务是否启动");
    } finally {
      setLoading(false);
    }
  }, [symbol, period, selectedIndicators]);

  // 支持从涨停板/选股结果深链进入：/kline?symbol=600519&name=贵州茅台
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sym = params.get("symbol");
    const nm = params.get("name");
    if (sym) {
      setSymbol(sym);
      setName(nm || sym);
    }
  }, []);

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
                aria-pressed={period === p.value}
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
          {error ? (
            <div className="bg-card border border-border rounded-lg h-[500px] flex flex-col items-center justify-center gap-3 text-muted">
              <span>{error}</span>
              <button
                onClick={fetchData}
                className="px-3 py-1.5 rounded border border-border text-xs hover:text-foreground"
              >
                重试
              </button>
            </div>
          ) : loading && klineData.length === 0 ? (
            <div className="bg-card border border-border rounded-lg h-[500px] flex items-center justify-center text-muted">
              加载中...
            </div>
          ) : klineData.length === 0 ? (
            <div className="bg-card border border-border rounded-lg h-[500px] flex items-center justify-center text-muted">
              暂无数据
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <KlineChart data={klineData} indicators={indicators} period={period} />
            </div>
          )}

          {selectedIndicators.includes("macd") && indicators.dif && (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <MacdChart
                dates={(indicators.date as unknown as string[]) || []}
                dif={indicators.dif}
                dea={indicators.dea || []}
                macd={indicators.macd || []}
                period={period}
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
