"use client";

import { useState, useEffect } from "react";
import FlowHeatmap from "@/components/capital/flow-heatmap";
import SectorFlowTable from "@/components/capital/sector-flow";
import NorthTrend from "@/components/capital/north-trend";
import type { SectorFlow, StockFlow, NorthFlow, NorthTopStock } from "@/lib/types";

export default function CapitalFlowPage() {
  const [dimension, setDimension] = useState("industry");
  const [sectorData, setSectorData] = useState<SectorFlow[]>([]);
  const [stockData, setStockData] = useState<StockFlow[]>([]);
  const [northRealtime, setNorthRealtime] = useState<{ totalNetInflow?: number } | null>(null);
  const [northHistory, setNorthHistory] = useState<NorthFlow[]>([]);
  const [northTop, setNorthTop] = useState<NorthTopStock[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCapital() {
      setLoading(true);
      try {
        const [sectorRes, stockRes] = await Promise.all([
          fetch(`/api/capital/sector-flow?dimension=${dimension}`),
          fetch("/api/capital/stock-flow?top=20"),
        ]);
        if (sectorRes.ok) setSectorData(await sectorRes.json());
        if (stockRes.ok) setStockData(await stockRes.json());
      } catch (err) {
        console.error("Failed to fetch capital data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCapital();
  }, [dimension]);

  useEffect(() => {
    async function fetchNorth() {
      try {
        const [realtimeRes, historyRes, topRes] = await Promise.all([
          fetch("/api/capital/north"),
          fetch("/api/capital/north/history?days=30"),
          fetch("/api/capital/north/top10"),
        ]);
        if (realtimeRes.ok) setNorthRealtime(await realtimeRes.json());
        if (historyRes.ok) setNorthHistory(await historyRes.json());
        if (topRes.ok) setNorthTop(await topRes.json());
      } catch (err) {
        console.error("Failed to fetch north data:", err);
      }
    }
    fetchNorth();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">资金流向</h2>

      <FlowHeatmap data={sectorData} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <SectorFlowTable
          sectorData={sectorData}
          stockData={stockData}
          dimension={dimension}
          onDimensionChange={setDimension}
        />
        <NorthTrend
          realtime={northRealtime}
          history={northHistory}
          topStocks={northTop}
        />
      </div>
    </div>
  );
}
