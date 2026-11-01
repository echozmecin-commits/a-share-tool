import { NextRequest } from "next/server";
import { pythonApiUrl } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date") || "";

  try {
    const res = await fetch(pythonApiUrl(`/api/limit-up/concepts?date=${date}`), {
      cache: "no-store",
    });
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json([], { status: 500 });
  }
}
