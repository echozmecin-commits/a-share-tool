"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CandlestickChart,
  TrendingUp,
  DollarSign,
  Home,
  ScanSearch,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "市场概览", icon: Home },
  { href: "/kline", label: "K线分析", icon: CandlestickChart },
  { href: "/dragon-tiger", label: "龙虎榜", icon: TrendingUp },
  { href: "/capital-flow", label: "资金流向", icon: DollarSign },
  { href: "/screener", label: "智能选股", icon: ScanSearch },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-card border-r border-border flex flex-col shrink-0">
      <div className="p-4 border-b border-border">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-accent" />
          A股助手
        </h1>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-accent/15 text-accent font-medium"
                  : "text-muted hover:text-foreground hover:bg-card-hover"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border text-xs text-muted">
        数据来源：AKShare
      </div>
    </aside>
  );
}
