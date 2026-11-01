"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Square, Loader2, CheckCircle2, Filter } from "lucide-react";
import ResultTable, { type ScreenerResult } from "@/components/screener/result-table";

interface TaskStatus {
  status: string;
  total: number;
  scanned: number;
  found: number;
  results: ScreenerResult[];
  currentStock: string;
  error?: string;
}

const CONDITIONS = [
  { label: "均线多头向上", desc: "6条均线（MA5/10/21/34/54/89）最新值均高于前一日，斜率为正" },
  { label: "均线多头排列", desc: "MA5 > MA10 > MA21 > MA34 > MA54 > MA89，严格多头排列" },
];

export default function ScreenerPage() {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<TaskStatus | null>(null);
  const [scanning, setScanning] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const pollStatus = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/screener/status?task_id=${id}`);
      if (!res.ok) return;
      const data: TaskStatus = await res.json();
      setStatus(data);

      if (data.status === "done" || data.status === "cancelled") {
        setScanning(false);
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = undefined;
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  async function handleStart() {
    setScanning(true);
    setStatus(null);

    try {
      const res = await fetch("/api/screener/start", { method: "POST" });
      const data = await res.json();
      if (data.taskId) {
        setTaskId(data.taskId);
        pollingRef.current = setInterval(() => pollStatus(data.taskId), 2000);
      }
    } catch {
      setScanning(false);
    }
  }

  async function handleCancel() {
    if (!taskId) return;
    await fetch(`/api/screener/cancel?task_id=${taskId}`, { method: "POST" });
    setScanning(false);
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = undefined;
    }
  }

  const progress = status && status.total > 0
    ? Math.round((status.scanned / status.total) * 100)
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">智能选股</h2>
      </div>

      {/* 筛选条件说明 */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-medium">筛选条件</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CONDITIONS.map((c, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">{c.label}</p>
                <p className="text-xs text-muted">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 扫描控制 */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-4">
          {!scanning ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              <Search className="w-4 h-4" />
              开始扫描
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors"
            >
              <Square className="w-3 h-3" />
              停止扫描
            </button>
          )}

          {status && (
            <div className="flex items-center gap-4 text-sm">
              {scanning && <Loader2 className="w-4 h-4 text-accent animate-spin" />}

              <span className="text-muted">
                {status.status === "fetching_stocks" && "正在获取全部A股列表..."}
                {status.status === "scanning" && (
                  <>
                    扫描中 {status.scanned}/{status.total}
                    <span className="text-muted ml-2">({status.currentStock})</span>
                  </>
                )}
                {status.status === "done" && "扫描完成"}
                {status.status === "cancelled" && "已取消"}
              </span>

              {status.found > 0 && (
                <span className="text-accent font-medium">
                  已发现 {status.found} 只
                </span>
              )}
            </div>
          )}
        </div>

        {/* 进度条 */}
        {scanning && status && status.total > 0 && (
          <div className="mt-3">
            <div className="h-1.5 bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted mt-1">{progress}%</p>
          </div>
        )}
      </div>

      {/* 结果表格 */}
      {status && status.results && status.results.length > 0 && (
        <ResultTable results={status.results} />
      )}

      {/* 扫描完成但无结果 */}
      {status && status.status === "done" && status.results.length === 0 && (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-muted">
            本次扫描未发现满足所有条件的股票。
          </p>
          <p className="text-xs text-muted mt-1">
            这可能意味着当前市场环境下 AI 板块尚未形成强势多头行情。
          </p>
        </div>
      )}
    </div>
  );
}
