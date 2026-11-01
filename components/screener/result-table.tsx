"use client";

import Link from "next/link";
import { formatPercent, getChangeColor } from "@/lib/utils";

export interface ScreenerResult {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  ma5: number;
  ma10: number;
  ma21: number;
  ma34: number;
  ma54: number;
  ma89: number;
  volume: number;
  volRatio: number;
}

interface ResultTableProps {
  results: ScreenerResult[];
}

export default function ResultTable({ results }: ResultTableProps) {
  if (results.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-medium">
          筛选结果 <span className="text-accent ml-1">{results.length} 只</span>
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-muted border-b border-border">
              <th className="text-left px-4 py-2">#</th>
              <th className="text-left px-4 py-2">代码</th>
              <th className="text-left px-4 py-2">名称</th>
              <th className="text-right px-4 py-2">现价</th>
              <th className="text-right px-4 py-2">涨跌幅</th>
              <th className="text-right px-4 py-2">较前日放量</th>
              <th className="text-right px-4 py-2">MA5</th>
              <th className="text-right px-4 py-2">MA10</th>
              <th className="text-right px-4 py-2">MA21</th>
              <th className="text-right px-4 py-2">MA89</th>
              <th className="text-center px-4 py-2">K线</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, i) => (
              <tr key={item.symbol} className="border-b border-border/30 hover:bg-card-hover">
                <td className="px-4 py-2 text-muted">{i + 1}</td>
                <td className="px-4 py-2 text-muted">{item.symbol}</td>
                <td className="px-4 py-2 font-medium">{item.name}</td>
                <td className={`px-4 py-2 text-right ${getChangeColor(item.changePercent)}`}>
                  {item.price.toFixed(2)}
                </td>
                <td className={`px-4 py-2 text-right ${getChangeColor(item.changePercent)}`}>
                  {formatPercent(item.changePercent)}
                </td>
                <td className="px-4 py-2 text-right text-red-400 font-medium">
                  {item.volRatio.toFixed(1)}x
                </td>
                <td className="px-4 py-2 text-right text-xs">{item.ma5.toFixed(2)}</td>
                <td className="px-4 py-2 text-right text-xs">{item.ma10.toFixed(2)}</td>
                <td className="px-4 py-2 text-right text-xs">{item.ma21.toFixed(2)}</td>
                <td className="px-4 py-2 text-right text-xs">{item.ma89.toFixed(2)}</td>
                <td className="px-4 py-2 text-center">
                  <Link
                    href={`/kline?symbol=${item.symbol}`}
                    className="text-xs text-accent hover:underline"
                  >
                    查看
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
