"use client";

import { cn } from "@/lib/utils";

interface IndicatorPanelProps {
  selected: string[];
  onChange: (indicators: string[]) => void;
}

const INDICATOR_GROUPS = [
  {
    label: "均线",
    items: [
      { key: "ma5", label: "MA5", color: "#f59e0b" },
      { key: "ma10", label: "MA10", color: "#3b82f6" },
      { key: "ma20", label: "MA20", color: "#ef4444" },
      { key: "ma60", label: "MA60", color: "#22c55e" },
      { key: "ma120", label: "MA120", color: "#a855f7" },
      { key: "ma250", label: "MA250", color: "#ec4899" },
    ],
  },
  {
    label: "技术指标",
    items: [
      { key: "macd", label: "MACD" },
      { key: "kdj", label: "KDJ" },
      { key: "boll", label: "BOLL" },
      { key: "rsi14", label: "RSI" },
    ],
  },
];

export default function IndicatorPanel({ selected, onChange }: IndicatorPanelProps) {
  function toggle(key: string) {
    if (selected.includes(key)) {
      onChange(selected.filter((k) => k !== key));
    } else {
      onChange([...selected, key]);
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <h3 className="text-sm font-medium text-foreground">技术指标</h3>
      {INDICATOR_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="text-xs text-muted mb-2">{group.label}</p>
          <div className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <button
                key={item.key}
                onClick={() => toggle(item.key)}
                className={cn(
                  "px-2.5 py-1 rounded text-xs transition-colors border",
                  selected.includes(item.key)
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-border text-muted hover:text-foreground hover:border-foreground/30"
                )}
              >
                {"color" in item && selected.includes(item.key) && (
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: item.color }}
                  />
                )}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
