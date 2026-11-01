import { pythonApiUrl } from "@/lib/utils";

export async function GET() {
  try {
    const res = await fetch(pythonApiUrl("/api/capital/north"), { cache: "no-store" });
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({}, { status: 500 });
  }
}
