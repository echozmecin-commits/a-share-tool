"use client";

import { formatAmount, getChangeColor } from "@/lib/utils";
import type { SectorFlow } from "@/lib/types";

interface FlowHeatmapProps {
  data: SectorFlow[];
}

function getHeatColor(value: number, maxAbs: number): string {
  if (maxAbs === 0) return "bg-gray-800";
  const ratio = Math.min(Math.abs(value) / maxAbs, 1);
  if (value > 0) {
    const alpha = Math.round(ratio * 80 + 20);
    return `bg-red-500/${alpha}`;
  } else {
    const alpha = Math.round(ratio * 80 + 20);
    return `bg-green-500/${alpha}`;
  }
}

export default function FlowHeatmap({ data }: FlowHeatmapProps) {
  const maxAbs = Math.max(...data.map((d) => Math.abs(d.mainNetInflow || 0)), 1);

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-sm font-medium mb-3">板块资金热力图</h3>
      <div className="grid grid-cols-5 gap-1.5">
        {data.slice(0, 30).map((item) => {
          const inflow = item.mainNetInflow || 0;
          const ratio = Math.min(Math.abs(inflow) / maxAbs, 1);
          const opacity = Math.round(ratio * 0.6 * 100 + 15) / 100;
          const bgColor = inflow >= 0 ? `rgba(239,68,68,${opacity})` : `rgba(34,197,94,${opacity})`;

          return (
            <div
              key={item.sector}
              className="rounded p-2 text-center cursor-default transition-transform hover:scale-105"
              style={{ backgroundColor: bgColor }}
              title={`${item.sector}: ${formatAmount(inflow)}`}
            >
              <p className="text-xs font-medium truncate">{item.sector}</p>
              <p className={`text-xs ${getChangeColor(inflow)}`}>
                {formatAmount(inflow)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
