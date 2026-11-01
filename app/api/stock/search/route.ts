import { NextRequest } from "next/server";
import { pythonApiUrl } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get("keyword") || "";

  try {
    const res = await fetch(pythonApiUrl(`/api/stock/search?keyword=${keyword}`), {
      cache: "no-store",
    });
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json([], { status: 500 });
  }
}
