import { requireServerViewer } from "@/lib/auth";
import { ok } from "@/lib/http";
import { generateProgressionSuggestions } from "@/modules/workout/server/progression-service";

export async function GET() {
  const viewer = await requireServerViewer();
  const suggestions = await generateProgressionSuggestions(viewer.profile.id);

  return ok(suggestions);
}
