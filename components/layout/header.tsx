"use client";

import { useEffect, useState } from "react";
import { formatPercent, getChangeColor } from "@/lib/utils";
import type { IndexData } from "@/lib/types";

const MOCK_INDICES: IndexData[] = [
  { symbol: "000001", name: "上证指数", price: 3350.25, change: 15.32, changePercent: 0.46 },
  { symbol: "399001", name: "深证成指", price: 10250.88, change: -28.65, changePercent: -0.28 },
  { symbol: "399006", name: "创业板指", price: 2085.33, change: 12.05, changePercent: 0.58 },
  { symbol: "000688", name: "科创50", price: 1025.66, change: -5.22, changePercent: -0.51 },
];

export default function Header() {
  const [indices, setIndices] = useState<IndexData[]>(MOCK_INDICES);

  useEffect(() => {
    async function fetchIndices() {
      try {
        const res = await fetch("/api/stock/quote?type=index");
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) setIndices(data);
        }
      } catch {}
    }
    fetchIndices();
    const timer = setInterval(fetchIndices, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-12 bg-card border-b border-border flex items-center px-4 gap-6 shrink-0">
      {indices.map((idx) => (
        <div key={idx.symbol} className="flex items-center gap-2 text-sm">
          <span className="text-muted">{idx.name}</span>
          <span className={getChangeColor(idx.change)}>
            {idx.price.toFixed(2)}
          </span>
          <span className={`text-xs ${getChangeColor(idx.changePercent)}`}>
            {formatPercent(idx.changePercent)}
          </span>
        </div>
      ))}
    </header>
  );
}
