"use client";

import { formatPercent, getChangeColor } from "@/lib/utils";
import type { LimitUpSummary, ConceptCluster } from "@/lib/types";
import Link from "next/link";

interface LimitUpBoardProps {
  summary: LimitUpSummary | null;
  concepts: ConceptCluster[];
  streakTiers: { streakDays: number; count: number; stocks: any[] }[];
}

export default function LimitUpBoard({ summary, concepts, streakTiers }: LimitUpBoardProps) {
  return (
    <div className="space-y-4">
      {summary && (
        <div className="grid grid-cols-4 gap-3">
          <StatCard label="涨停" value={summary.limitUpCount} color="text-red-500" />
          <StatCard label="跌停" value={summary.limitDownCount} color="text-green-500" />
          <StatCard label="炸板" value={summary.brokenCount} color="text-yellow-500" />
          <StatCard
            label="连板股"
            value={Object.entries(summary.streakDistribution)
              .filter(([k]) => parseInt(k) >= 2)
              .reduce((sum, [, v]) => sum + v, 0)}
            color="text-accent"
          />
        </div>
      )}

      {streakTiers.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3">连板梯队</h3>
          <div className="space-y-3">
            {streakTiers.map((tier) => (
              <div key={tier.streakDays}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-accent/15 text-accent">
                    {tier.streakDays}连板
                  </span>
                  <span className="text-xs text-muted">{tier.count}只</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tier.stocks.map((s: any) => (
                    <Link
                      key={s.symbol}
                      href={`/kline?symbol=${s.symbol}`}
                      className="text-xs px-2 py-1 rounded bg-card-hover hover:bg-border transition-colors"
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {concepts.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3">涨停概念聚类</h3>
          <div className="space-y-2">
            {concepts.slice(0, 15).map((c) => (
              <div key={c.concept} className="flex items-center gap-3">
                <span className="text-sm w-24 truncate">{c.concept}</span>
                <div className="flex-1 h-5 bg-background rounded overflow-hidden">
                  <div
                    className="h-full bg-red-500/30 rounded flex items-center px-2"
                    style={{
                      width: `${Math.min((c.count / (concepts[0]?.count || 1)) * 100, 100)}%`,
                    }}
                  >
                    <span className="text-xs text-red-400">{c.count}只</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {c.stocks.slice(0, 3).map((s) => (
                    <span key={s.symbol} className="text-xs text-muted">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-3 text-center">
      <p className="text-xs text-muted">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
