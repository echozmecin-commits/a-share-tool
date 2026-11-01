import { NextRequest } from "next/server";
import { pythonApiUrl } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const top = request.nextUrl.searchParams.get("top") || "20";

  try {
    const res = await fetch(pythonApiUrl(`/api/capital/stock-flow?top=${top}`), {
      cache: "no-store",
    });
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json([], { status: 500 });
  }
}
