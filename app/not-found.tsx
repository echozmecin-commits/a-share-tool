import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-lg font-medium">页面不存在</h2>
      <p className="text-sm text-muted">这个地址没有对应的页面。</p>
      <Link href="/" className="px-4 py-2 rounded border border-border text-sm hover:text-foreground">
        回到市场概览
      </Link>
    </div>
  );
}
