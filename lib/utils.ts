import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(num: number): string {
  if (Math.abs(num) >= 1e8) return (num / 1e8).toFixed(2) + "亿";
  if (Math.abs(num) >= 1e4) return (num / 1e4).toFixed(2) + "万";
  return num.toFixed(2);
}

export function formatAmount(num: number): string {
  if (Math.abs(num) >= 1e8) return (num / 1e8).toFixed(2) + "亿";
  if (Math.abs(num) >= 1e4) return (num / 1e4).toFixed(2) + "万";
  return num.toFixed(2);
}

export function formatPercent(num: number): string {
  return (num >= 0 ? "+" : "") + num.toFixed(2) + "%";
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

const PYTHON_API_BASE = process.env.NEXT_PUBLIC_PYTHON_API || "http://localhost:8000";

export function pythonApiUrl(path: string): string {
  return `${PYTHON_API_BASE}${path}`;
}
