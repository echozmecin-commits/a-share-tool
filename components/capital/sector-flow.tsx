"use client";

import { formatAmount, getChangeColor, formatPercent } from "@/lib/utils";
import type { SectorFlow, StockFlow } from "@/lib/types";

interface SectorFlowTableProps {
  sectorData: SectorFlow[];
  stockData: StockFlow[];
  dimension: string;
  onDimensionChange: (dim: string) => void;
}

export default function SectorFlowTable({
  sectorData,
  stockData,
  dimension,
  onDimensionChange,
}: SectorFlowTableProps) {
  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-medium">板块资金流向</h3>
          <div className="flex gap-1 bg-background rounded p-0.5">
            {[
              { key: "industry", label: "行业" },
              { key: "concept", label: "概念" },
            ].map((d) => (
              <button
                key={d.key}
                onClick={() => onDimensionChange(d.key)}
                className={`px-2.5 py-0.5 rounded text-xs transition-colors ${
                  dimension === d.key
                    ? "bg-accent text-white"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card">
              <tr className="text-xs text-muted border-b border-border">
                <th className="text-left px-4 py-2">#</th>
                <th className="text-left px-4 py-2">板块</th>
                <th className="text-right px-4 py-2">主力净流入</th>
                <th className="text-right px-4 py-2">涨跌幅</th>
              </tr>
            </thead>
            <tbody>
              {sectorData.map((item, i) => (
                <tr key={item.sector} className="border-b border-border/30 hover:bg-card-hover">
                  <td className="px-4 py-1.5 text-muted">{i + 1}</td>
                  <td className="px-4 py-1.5">{item.sector}</td>
                  <td className={`px-4 py-1.5 text-right ${getChangeColor(item.mainNetInflow)}`}>
                    {formatAmount(item.mainNetInflow)}
                  </td>
                  <td className={`px-4 py-1.5 text-right ${getChangeColor(item.changePercent)}`}>
                    {formatPercent(item.changePercent)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-medium">个股资金净流入 Top 20</h3>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card">
              <tr className="text-xs text-muted border-b border-border">
                <th className="text-left px-4 py-2">#</th>
                <th className="text-left px-4 py-2">代码</th>
                <th className="text-left px-4 py-2">名称</th>
                <th className="text-right px-4 py-2">主力净流入</th>
                <th className="text-right px-4 py-2">涨跌幅</th>
              </tr>
            </thead>
            <tbody>
              {stockData.map((item, i) => (
                <tr key={item.symbol} className="border-b border-border/30 hover:bg-card-hover">
                  <td className="px-4 py-1.5 text-muted">{i + 1}</td>
                  <td className="px-4 py-1.5 text-muted">{item.symbol}</td>
                  <td className="px-4 py-1.5">{item.name}</td>
                  <td className={`px-4 py-1.5 text-right ${getChangeColor(item.mainNetInflow)}`}>
                    {formatAmount(item.mainNetInflow)}
                  </td>
                  <td className={`px-4 py-1.5 text-right ${getChangeColor(item.changePercent)}`}>
                    {formatPercent(item.changePercent)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
