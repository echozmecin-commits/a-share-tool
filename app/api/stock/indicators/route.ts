import { NextRequest } from "next/server";
import { pythonApiUrl } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const symbol = searchParams.get("symbol") || "";
  const period = searchParams.get("period") || "daily";
  const indicators = searchParams.get("indicators") || "ma5,ma10,ma20,macd";
  const start = searchParams.get("start") || "";

  try {
    const url = pythonApiUrl(
      `/api/stock/indicators?symbol=${symbol}&period=${period}&indicators=${indicators}&start=${start}`
    );
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({}, { status: 500 });
  }
}
