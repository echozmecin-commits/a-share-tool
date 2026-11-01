"use client";

import { useState, useEffect } from "react";
import DragonTable from "@/components/dragon-tiger/dragon-table";
import LimitUpBoard from "@/components/dragon-tiger/limit-up-board";
import type { DragonTigerItem, LimitUpSummary, ConceptCluster } from "@/lib/types";
import { Calendar } from "lucide-react";

export default function DragonTigerPage() {
  const [date, setDate] = useState(() => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  });
  const [dragonData, setDragonData] = useState<DragonTigerItem[]>([]);
  const [summary, setSummary] = useState<LimitUpSummary | null>(null);
  const [concepts, setConcepts] = useState<ConceptCluster[]>([]);
  const [streakTiers, setStreakTiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [dragonRes, summaryRes, conceptRes, streakRes] = await Promise.all([
          fetch(`/api/dragon-tiger/list?date=${date}`),
          fetch(`/api/limit-up/summary?date=${date}`),
          fetch(`/api/limit-up/concepts?date=${date}`),
          fetch(`/api/limit-up/streak?date=${date}`),
        ]);

        if (dragonRes.ok) setDragonData(await dragonRes.json());
        if (summaryRes.ok) setSummary(await summaryRes.json());
        if (conceptRes.ok) setConcepts(await conceptRes.json());
        if (streakRes.ok) setStreakTiers(await streakRes.json());
      } catch (err) {
        console.error("Failed to fetch dragon tiger data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [date]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">龙虎榜 & 涨停复盘</h2>
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-1.5">
          <Calendar className="w-4 h-4 text-muted" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-transparent text-sm outline-none text-foreground"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center text-muted py-12">加载中...</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <DragonTable data={dragonData} />
          <LimitUpBoard summary={summary} concepts={concepts} streakTiers={streakTiers} />
        </div>
      )}
    </div>
  );
}
