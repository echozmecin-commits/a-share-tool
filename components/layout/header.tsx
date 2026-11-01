"use client";

import { useEffect, useState } from "react";
import { formatPercent, getChangeColor } from "@/lib/utils";
import type { IndexData } from "@/lib/types";

export default function Header() {
  const [indices, setIndices] = useState<IndexData[]>([]);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    async function fetchIndices() {
      try {
        const res = await fetch("/api/stock/quote?type=index", { cache: "no-store" });
        if (!res.ok) throw new Error("quote request failed");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setIndices(data);
          setOffline(false);
        } else {
          setOffline(true);
        }
      } catch {
        setOffline(true);
      }
    }
    fetchIndices();
    const timer = setInterval(() => {
      if (!document.hidden) fetchIndices();
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-12 bg-card border-b border-border flex items-center px-4 gap-6 shrink-0 overflow-x-auto">
      {indices.length === 0 ? (
        <span className="text-xs text-muted">
          {offline ? "行情数据未连接（请启动 Python 数据服务）" : "行情加载中…"}
        </span>
      ) : (
        indices.map((idx) => (
          <div key={idx.symbol} className="flex items-center gap-2 text-sm whitespace-nowrap">
            <span className="text-muted">{idx.name}</span>
            <span className={getChangeColor(idx.change)}>
              {Number.isFinite(idx.price) ? idx.price.toFixed(2) : "—"}
            </span>
            <span className={`text-xs ${getChangeColor(idx.changePercent)}`}>
              {formatPercent(idx.changePercent)}
            </span>
          </div>
        ))
      )}
      {offline && indices.length > 0 && (
        <span className="text-[10px] text-amber-500 border border-amber-500/40 rounded px-1.5 py-0.5 whitespace-nowrap">
          数据可能延迟
        </span>
      )}
    </header>
  );
}
