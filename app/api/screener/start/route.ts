import { pythonApiUrl } from "@/lib/utils";

export async function POST() {
  try {
    const res = await fetch(pythonApiUrl("/api/screener/start"), {
      method: "POST",
      cache: "no-store",
    });
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({ error: "failed to start" }, { status: 500 });
  }
}
