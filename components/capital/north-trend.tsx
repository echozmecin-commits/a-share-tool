"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { formatAmount } from "@/lib/utils";
import type { NorthFlow, NorthTopStock } from "@/lib/types";

interface NorthTrendProps {
  realtime: { totalNetInflow?: number } | null;
  history: NorthFlow[];
  topStocks: NorthTopStock[];
}

export default function NorthTrend({ realtime, history, topStocks }: NorthTrendProps) {
  const chartData = history.map((d) => ({
    date: d.date.slice(5),
    value: d.totalNetInflow / 1e8,
  }));

  return (
    <div className="space-y-4">
      {realtime && realtime.totalNetInflow !== undefined && (
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted mb-1">北向资金今日净流入</p>
          <p
            className={`text-3xl font-bold ${
              realtime.totalNetInflow >= 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            {formatAmount(realtime.totalNetInflow)}
          </p>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-medium mb-3">北向资金近30日趋势（亿元）</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2f3542" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#71767b" }} />
            <YAxis tick={{ fontSize: 10, fill: "#71767b" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1f2e",
                border: "1px solid #2f3542",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value) => [`${Number(value).toFixed(2)}亿`, "净流入"]}
            />
            <ReferenceLine y={0} stroke="#71767b" strokeDasharray="3 3" />
            <defs>
              <linearGradient id="northGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#ef4444"
              fill="url(#northGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-medium">北向资金十大活跃股</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-muted border-b border-border">
              <th className="text-left px-4 py-2">代码</th>
              <th className="text-left px-4 py-2">名称</th>
              <th className="text-right px-4 py-2">持股市值</th>
              <th className="text-right px-4 py-2">较前日变化</th>
            </tr>
          </thead>
          <tbody>
            {topStocks.map((s) => (
              <tr key={s.symbol} className="border-b border-border/30 hover:bg-card-hover">
                <td className="px-4 py-1.5 text-muted">{s.symbol}</td>
                <td className="px-4 py-1.5">{s.name}</td>
                <td className="px-4 py-1.5 text-right">{formatAmount(s.marketValue)}</td>
                <td
                  className={`px-4 py-1.5 text-right ${
                    s.changeFromPrev >= 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {formatAmount(s.changeFromPrev)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {topStocks.length === 0 && (
          <div className="text-center text-muted py-6 text-sm">暂无数据</div>
        )}
      </div>
    </div>
  );
}
