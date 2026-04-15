import { ApiResponse } from "@/types/api";
import { SessionDraft } from "@/modules/workout/types/session-client";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const json = (await response.json()) as ApiResponse<T>;

  if (!response.ok || json.error) {
    throw new Error(json.error ?? "Unknown request error");
  }

  if (!json.data) {
    throw new Error("Missing response payload");
  }

  return json.data;
}

export async function createSession(payload: { templateId?: string; sessionDate: string }) {
  return fetchJson<{ id: string }>("/api/workouts/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
}

export async function getSession(sessionId: string) {
  return fetchJson<Record<string, unknown>>(`/api/workouts/sessions/${sessionId}`);
}

export async function saveSessionDraft(draft: SessionDraft) {
  const sets = draft.exercises.flatMap((exercise) => exercise.sets);

  return fetchJson(`/api/workouts/sessions/${draft.sessionId}/sets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      sets,
      durationSeconds: draft.durationSeconds,
      notes: draft.notes,
      status: draft.status,
      disciplineScore: draft.disciplineScore,
      recoveryWarning: draft.recoveryWarning
    })
  });
}
