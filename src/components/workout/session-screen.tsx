"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Lock, Save, Trash2 } from "lucide-react";
import { SessionDraft } from "@/modules/workout/types/session-client";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SessionTimer } from "@/components/workout/session-timer";
import { BlockSection } from "@/components/workout/block-section";
import { useSessionStore } from "@/state/use-session-store";
import { trackEvent } from "@/modules/analytics/tracker";
import { analyticsEvents } from "@/types/analytics";

interface SessionScreenProps {
  initialDraft: SessionDraft;
}

export function SessionScreen({ initialDraft }: SessionScreenProps) {
  const router = useRouter();
  const draft = useSessionStore((state) => state.draft);
  const dirty = useSessionStore((state) => state.dirty);
  const lastSavedAt = useSessionStore((state) => state.lastSavedAt);
  const setDraft = useSessionStore((state) => state.setDraft);
  const setSessionDate = useSessionStore((state) => state.setSessionDate);
  const setNotes = useSessionStore((state) => state.setNotes);
  const setStatus = useSessionStore((state) => state.setStatus);
  const saveNow = useSessionStore((state) => state.saveNow);

  useEffect(() => {
    setDraft(initialDraft);
  }, [initialDraft, setDraft]);

  const blocks = useMemo(() => {
    if (!draft) {
      return {
        warmup: [],
        strength: [],
        cardio: [],
        cooldown: []
      };
    }

    return {
      warmup: draft.exercises.filter((exercise) => exercise.blockType === "WARMUP"),
      strength: draft.exercises.filter((exercise) => exercise.blockType === "STRENGTH"),
      cardio: draft.exercises.filter((exercise) => exercise.blockType === "CARDIO"),
      cooldown: draft.exercises.filter((exercise) => exercise.blockType === "COOLDOWN")
    };
  }, [draft]);

  async function finalizeSession(status: "COMPLETED" | "DISCARDED" | "LOCKED") {
    setStatus(status);
    await saveNow();

    await trackEvent({
      category: "workout",
      eventName:
        status === "COMPLETED"
          ? analyticsEvents.SESSION_COMPLETED
          : status === "DISCARDED"
            ? analyticsEvents.SESSION_DISCARDED
            : analyticsEvents.SESSION_COMPLETED,
      sessionId: draft?.sessionId
    });

    router.push("/dashboard");
    router.refresh();
  }

  if (!draft) {
    return null;
  }

  return (
    <div className="space-y-5 pb-24">
      <PageHeader
        title="Daily Session"
        subtitle="Warm-up, strength, cardio, and cooldown in one adaptive flow"
        action={<span className="stat-chip">{dirty ? "Autosaving..." : "Synced"}</span>}
      />

      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <Input type="date" value={draft.sessionDate} onChange={(event) => setSessionDate(event.target.value)} />
        <SessionTimer />
      </div>

      <Textarea
        placeholder="Session notes, intent, RPE, or recovery markers"
        value={draft.notes ?? ""}
        onChange={(event) => setNotes(event.target.value)}
      />

      <BlockSection title="Warm-Up" subtitle="Prime movement" exercises={blocks.warmup} />
      <BlockSection title="Strength" subtitle="Progressive load" exercises={blocks.strength} />
      <BlockSection title="Cardio" subtitle="Conditioning" exercises={blocks.cardio} />
      <BlockSection title="Cooldown" subtitle="Recovery" exercises={blocks.cooldown} />

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Button variant="outline" onClick={() => saveNow()}>
          <Save className="mr-2 h-4 w-4" />
          Save Draft
        </Button>
        <Button variant="danger" onClick={() => finalizeSession("DISCARDED")}>
          <Trash2 className="mr-2 h-4 w-4" />
          Discard Session
        </Button>
        <Button variant="secondary" onClick={() => finalizeSession("LOCKED")}>
          <Lock className="mr-2 h-4 w-4" />
          Lock Workout
        </Button>
        <Button onClick={() => finalizeSession("COMPLETED")}>Finish Session</Button>
      </div>

      {lastSavedAt ? (
        <p className="text-xs text-foreground/60">Last saved {new Date(lastSavedAt).toLocaleTimeString()}</p>
      ) : null}
    </div>
  );
}
