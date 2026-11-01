"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";

interface SearchResult {
  symbol: string;
  name: string;
}

interface StockSearchProps {
  onSelect: (symbol: string, name: string) => void;
  currentSymbol?: string;
  currentName?: string;
}

export default function StockSearch({ onSelect, currentSymbol, currentName }: StockSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!value.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/stock/search?keyword=${encodeURIComponent(value)}`);
        const data = await res.json();
        setResults(data);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }

  return (
    <div ref={ref} className="relative w-72">
      <div className="flex items-center bg-card border border-border rounded-lg px-3 py-2">
        <Search className="w-4 h-4 text-muted mr-2" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={currentSymbol ? `${currentName} (${currentSymbol})` : "输入股票代码或名称..."}
          className="bg-transparent text-sm outline-none flex-1 text-foreground placeholder:text-muted"
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
          {results.map((r) => (
            <button
              key={r.symbol}
              className="w-full px-3 py-2 text-sm text-left hover:bg-card-hover flex justify-between"
              onClick={() => {
                onSelect(r.symbol, r.name);
                setQuery("");
                setOpen(false);
              }}
            >
              <span className="text-foreground">{r.name}</span>
              <span className="text-muted">{r.symbol}</span>
            </button>
          ))}
        </div>
      )}
      {open && loading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg p-3 text-sm text-muted">
          搜索中...
        </div>
      )}
    </div>
  );
}
