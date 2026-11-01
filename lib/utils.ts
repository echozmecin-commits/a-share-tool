import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(num: number | null | undefined): string {
  if (!Number.isFinite(num as number)) return "—";
  const n = num as number;
  if (Math.abs(n) >= 1e8) return (n / 1e8).toFixed(2) + "亿";
  if (Math.abs(n) >= 1e4) return (n / 1e4).toFixed(2) + "万";
  return n.toFixed(2);
}

export function formatAmount(num: number | null | undefined): string {
  if (!Number.isFinite(num as number)) return "—";
  const n = num as number;
  if (Math.abs(n) >= 1e8) return (n / 1e8).toFixed(2) + "亿";
  if (Math.abs(n) >= 1e4) return (n / 1e4).toFixed(2) + "万";
  return n.toFixed(2);
}

export function formatPercent(num: number | null | undefined): string {
  if (!Number.isFinite(num as number)) return "—";
  const n = num as number;
  return (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
}

/**
 * Lightweight Charts 只接受 `YYYY-MM-DD`（日线）或 UNIX 秒（分钟线）。
 * akshare 的分钟线返回 `YYYY-MM-DD HH:MM:SS`，直接传会报 Invalid date string。
 */
export function toChartTime(value: string, period?: string): string | number {
  if (!value) return value;
  const isIntraday = period === "5" || period === "15" || period === "30" || period === "60";
  if (isIntraday) {
    const ms = new Date(value.includes("T") ? value : value.replace(" ", "T")).getTime();
    return Number.isFinite(ms) ? Math.floor(ms / 1000) : value;
  }
  return value.split(" ")[0];
}

export function getChangeColor(value: number): string {
  if (value > 0) return "text-red-500";
  if (value < 0) return "text-green-500";
  return "text-gray-500";
}

export function getChangeBgColor(value: number): string {
  if (value > 0) return "bg-red-500/10";
  if (value < 0) return "bg-green-500/10";
  return "bg-gray-500/10";
}

const PYTHON_API_BASE = process.env.PYTHON_API_URL || "http://localhost:8000";

export function pythonApiUrl(path: string): string {
  return `${PYTHON_API_BASE}${path}`;
}
