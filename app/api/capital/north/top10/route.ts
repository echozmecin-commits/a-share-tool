import { pythonApiUrl } from "@/lib/utils";

export async function GET() {
  try {
    const res = await fetch(pythonApiUrl("/api/capital/north/top10"), { cache: "no-store" });
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json([], { status: 500 });
  }
}
