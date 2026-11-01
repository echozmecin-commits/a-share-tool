"use client";

import { useState, useEffect } from "react";
import { TrendingUp, DollarSign, BarChart3 } from "lucide-react";
import { formatAmount, getChangeColor } from "@/lib/utils";
import Link from "next/link";

interface DashboardData {
  limitUpSummary: any;
  northFlow: any;
  topSectors: any[];
  dragonTiger: any[];
}

export default function HomePage() {
  const [data, setData] = useState<DashboardData>({
    limitUpSummary: null,
    northFlow: null,
    topSectors: [],
    dragonTiger: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [summaryRes, northRes, sectorRes, dragonRes] = await Promise.all([
          fetch("/api/limit-up/summary"),
          fetch("/api/capital/north"),
          fetch("/api/capital/sector-flow?dimension=industry"),
          fetch("/api/dragon-tiger/list"),
        ]);

        const limitUpSummary = summaryRes.ok ? await summaryRes.json() : null;
        const northFlow = northRes.ok ? await northRes.json() : null;
        const topSectors = sectorRes.ok ? await sectorRes.json() : [];
        const dragonTiger = dragonRes.ok ? await dragonRes.json() : [];

        setData({ limitUpSummary, northFlow, topSectors, dragonTiger });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-muted">
        正在加载市场数据...
      </div>
    );
  }

  const { limitUpSummary, northFlow, topSectors, dragonTiger } = data;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">市场概览</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dragon-tiger" className="block">
          <div className="bg-card border border-border rounded-lg p-4 hover:bg-card-hover transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-medium">今日涨停概况</h3>
            </div>
            {limitUpSummary ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted text-sm">涨停</span>
                  <span className="text-red-500 font-bold text-lg">
                    {limitUpSummary.limitUpCount || 0}
                  </span>
                </div>
                {limitUpSummary.stocks && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted mb-1">热门概念</p>
                    <div className="flex flex-wrap gap-1">
                      {getTopConcepts(limitUpSummary.stocks)
                        .slice(0, 5)
                        .map(([concept, count]) => (
                          <span
                            key={concept}
                            className="text-xs px-1.5 py-0.5 rounded bg-red-500/10 text-red-400"
                          >
                            {concept} {count}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted text-sm">暂无数据</p>
            )}
          </div>
        </Link>

        <Link href="/capital-flow" className="block">
          <div className="bg-card border border-border rounded-lg p-4 hover:bg-card-hover transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-medium">北向资金</h3>
            </div>
            {northFlow && northFlow.totalNetInflow !== undefined ? (
              <div>
                <p className="text-xs text-muted mb-1">今日净流入</p>
                <p
                  className={`text-2xl font-bold ${
                    northFlow.totalNetInflow >= 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {formatAmount(northFlow.totalNetInflow)}
                </p>
              </div>
            ) : (
              <p className="text-muted text-sm">暂无数据</p>
            )}
          </div>
        </Link>

        <Link href="/capital-flow" className="block">
          <div className="bg-card border border-border rounded-lg p-4 hover:bg-card-hover transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-yellow-500" />
              <h3 className="text-sm font-medium">主力资金 Top5</h3>
            </div>
            {topSectors.length > 0 ? (
              <div className="space-y-1.5">
                {topSectors.slice(0, 5).map((s: any, i: number) => (
                  <div key={s.sector} className="flex items-center justify-between text-sm">
                    <span className="text-muted w-4">{i + 1}</span>
                    <span className="flex-1 ml-2 truncate">{s.sector}</span>
                    <span className={getChangeColor(s.mainNetInflow)}>
                      {formatAmount(s.mainNetInflow)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-sm">暂无数据</p>
            )}
          </div>
        </Link>
      </div>

      {dragonTiger.length > 0 && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-medium">龙虎榜速览</h3>
            <Link href="/dragon-tiger" className="text-xs text-accent hover:underline">
              查看全部
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted border-b border-border">
                <th className="text-left px-4 py-2">代码</th>
                <th className="text-left px-4 py-2">名称</th>
                <th className="text-left px-4 py-2">上榜原因</th>
                <th className="text-right px-4 py-2">净买入</th>
              </tr>
            </thead>
            <tbody>
              {dragonTiger.slice(0, 5).map((item: any) => (
                <tr key={item.symbol} className="border-b border-border/30 hover:bg-card-hover">
                  <td className="px-4 py-2 text-muted">{item.symbol}</td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2 text-xs text-muted">{item.reason}</td>
                  <td className={`px-4 py-2 text-right ${getChangeColor(item.netAmount)}`}>
                    {formatAmount(item.netAmount || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function getTopConcepts(stocks: any[]): [string, number][] {
  const map: Record<string, number> = {};
  for (const s of stocks) {
    const concept = s.concept || "其他";
    map[concept] = (map[concept] || 0) + 1;
  }
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}
