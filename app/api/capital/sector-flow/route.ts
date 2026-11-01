import { NextRequest } from "next/server";
import { pythonApiUrl } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const dimension = request.nextUrl.searchParams.get("dimension") || "industry";

  try {
    const res = await fetch(pythonApiUrl(`/api/capital/sector-flow?dimension=${dimension}`), {
      cache: "no-store",
    });
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json([], { status: 500 });
  }
}
