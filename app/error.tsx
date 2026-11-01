"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-lg font-medium">页面加载失败</h2>
      <p className="text-sm text-muted max-w-md">
        {error.message || "数据服务可能未启动，或上游接口暂时不可用。"}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 rounded border border-border text-sm hover:text-foreground"
      >
        重试
      </button>
    </div>
  );
}
