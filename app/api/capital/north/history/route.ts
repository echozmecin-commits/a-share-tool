import { NextRequest } from "next/server";
import { pythonApiUrl } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const days = request.nextUrl.searchParams.get("days") || "30";

  try {
    const res = await fetch(pythonApiUrl(`/api/capital/north/history?days=${days}`), {
      cache: "no-store",
    });
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json([], { status: 500 });
  }
}
