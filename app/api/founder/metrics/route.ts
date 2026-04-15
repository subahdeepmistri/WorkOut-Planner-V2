import { ok } from "@/lib/http";
import { getFounderMetrics } from "@/server/admin/founder-metrics";

export async function GET() {
  const metrics = await getFounderMetrics();
  return ok(metrics);
}
