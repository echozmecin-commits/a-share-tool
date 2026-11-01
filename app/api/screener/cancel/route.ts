import { NextRequest } from "next/server";
import { pythonApiUrl } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const taskId = request.nextUrl.searchParams.get("task_id") || "";

  try {
    const res = await fetch(pythonApiUrl(`/api/screener/cancel?task_id=${taskId}`), {
      method: "POST",
      cache: "no-store",
    });
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({ error: "failed" }, { status: 500 });
  }
}
