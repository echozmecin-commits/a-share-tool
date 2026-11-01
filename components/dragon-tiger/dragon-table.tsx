"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { formatAmount, getChangeColor } from "@/lib/utils";
import type { DragonTigerItem } from "@/lib/types";

const FAMOUS_SEATS = [
  "东方财富证券拉萨",
  "华鑫证券上海",
  "中国银河证券绍兴",
  "东方财富证券拉萨团结路",
  "东方财富证券拉萨东环路",
  "国泰君安上海江苏路",
  "中信证券上海分公司",
];

interface DragonTableProps {
  data: DragonTigerItem[];
}

export default function DragonTable({ data }: DragonTableProps) {
  const [expandedSymbol, setExpandedSymbol] = useState<string | null>(null);

  function isFamousSeat(name: string): boolean {
    return FAMOUS_SEATS.some((s) => name.includes(s));
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-medium">龙虎榜</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-muted border-b border-border">
              <th className="text-left px-4 py-2 w-8"></th>
              <th className="text-left px-4 py-2">代码</th>
              <th className="text-left px-4 py-2">名称</th>
              <th className="text-left px-4 py-2">上榜原因</th>
              <th className="text-right px-4 py-2">买入额</th>
              <th className="text-right px-4 py-2">卖出额</th>
              <th className="text-right px-4 py-2">净买入</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <>
                <tr
                  key={item.symbol}
                  className="border-b border-border/50 hover:bg-card-hover cursor-pointer"
                  onClick={() =>
                    setExpandedSymbol(expandedSymbol === item.symbol ? null : item.symbol)
                  }
                >
                  <td className="px-4 py-2">
                    {expandedSymbol === item.symbol ? (
                      <ChevronDown className="w-3 h-3 text-muted" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-muted" />
                    )}
                  </td>
                  <td className="px-4 py-2 text-muted">{item.symbol}</td>
                  <td className="px-4 py-2 font-medium">{item.name}</td>
                  <td className="px-4 py-2 text-muted text-xs">{item.reason}</td>
                  <td className="px-4 py-2 text-right text-red-500">
                    {formatAmount(item.buyAmount)}
                  </td>
                  <td className="px-4 py-2 text-right text-green-500">
                    {formatAmount(item.sellAmount)}
                  </td>
                  <td className={`px-4 py-2 text-right font-medium ${getChangeColor(item.netAmount)}`}>
                    {formatAmount(item.netAmount)}
                  </td>
                </tr>
                {expandedSymbol === item.symbol && item.seats && (
                  <tr key={`${item.symbol}-seats`}>
                    <td colSpan={7} className="px-8 py-2 bg-background/50">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted mb-1">买入席位</p>
                          {item.seats
                            .filter((s) => s.type === "buy")
                            .map((seat, i) => (
                              <div
                                key={i}
                                className="flex justify-between text-xs py-0.5"
                              >
                                <span className={isFamousSeat(seat.seatName) ? "text-accent" : "text-foreground"}>
                                  {seat.seatName}
                                  {isFamousSeat(seat.seatName) && " *"}
                                </span>
                                <span className="text-red-500">
                                  {formatAmount(seat.buyAmount)}
                                </span>
                              </div>
                            ))}
                        </div>
                        <div>
                          <p className="text-xs text-muted mb-1">卖出席位</p>
                          {item.seats
                            .filter((s) => s.type === "sell")
                            .map((seat, i) => (
                              <div
                                key={i}
                                className="flex justify-between text-xs py-0.5"
                              >
                                <span className={isFamousSeat(seat.seatName) ? "text-accent" : "text-foreground"}>
                                  {seat.seatName}
                                  {isFamousSeat(seat.seatName) && " *"}
                                </span>
                                <span className="text-green-500">
                                  {formatAmount(seat.sellAmount)}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        {data.length === 0 && (
          <div className="text-center text-muted py-8 text-sm">暂无龙虎榜数据</div>
        )}
      </div>
    </div>
  );
}
