"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SessionDraft, SessionExercise, SessionExerciseSet } from "@/modules/workout/types/session-client";
import { addPendingMutation } from "@/lib/offline/queue";
import { saveSessionDraft } from "@/modules/workout/client/api";

interface SessionState {
  draft: SessionDraft | null;
  loading: boolean;
  dirty: boolean;
  lastSavedAt?: string;
  setDraft: (draft: SessionDraft) => void;
  setSessionDate: (date: string) => void;
  setNotes: (notes: string) => void;
  addSet: (exerciseId: string) => void;
  removeSet: (exerciseId: string, setNumber: number) => void;
  duplicatePreviousSet: (exerciseId: string, setNumber: number) => void;
  autoFillPreviousWeight: (exerciseId: string, setNumber: number) => void;
  updateSet: (exerciseId: string, setNumber: number, patch: Partial<SessionExerciseSet>) => void;
  markSetCompleted: (exerciseId: string, setNumber: number, completed: boolean) => void;
  setStatus: (status: SessionDraft["status"]) => void;
  setDuration: (seconds: number) => void;
  saveNow: () => Promise<void>;
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;

function mapExercises(
  exercises: SessionExercise[],
  mapper: (exercise: SessionExercise) => SessionExercise
): SessionExercise[] {
  return exercises.map((exercise) => mapper(exercise));
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      draft: null,
      loading: false,
      dirty: false,
      setDraft: (draft) => set({ draft, dirty: false }),
      setSessionDate: (date) => {
        set((state) => ({
          draft: state.draft ? { ...state.draft, sessionDate: date } : null,
          dirty: true
        }));
        queueAutosave();
      },
      setNotes: (notes) => {
        set((state) => ({
          draft: state.draft ? { ...state.draft, notes } : null,
          dirty: true
        }));
        queueAutosave();
      },
      addSet: (exerciseId) => {
        set((state) => ({
          draft: state.draft
            ? {
                ...state.draft,
                exercises: mapExercises(state.draft.exercises, (exercise) => {
                  if (exercise.exerciseId !== exerciseId) {
                    return exercise;
                  }

                  const previous = exercise.sets[exercise.sets.length - 1];

                  return {
                    ...exercise,
                    targetSets: exercise.targetSets + 1,
                    sets: [
                      ...exercise.sets,
                      {
                        exerciseId,
                        setNumber: exercise.sets.length + 1,
                        isWarmup: false,
                        targetReps: previous?.targetReps ?? null,
                        completedReps: null,
                        targetWeightKg: previous?.targetWeightKg ?? null,
                        completedWeightKg: null,
                        targetDurationSec: previous?.targetDurationSec ?? null,
                        completedDurationSec: null,
                        restSeconds: previous?.restSeconds ?? 90,
                        isCompleted: false
                      }
                    ]
                  };
                })
              }
            : null,
          dirty: true
        }));
        queueAutosave();
      },
      removeSet: (exerciseId, setNumber) => {
        set((state) => ({
          draft: state.draft
            ? {
                ...state.draft,
                exercises: mapExercises(state.draft.exercises, (exercise) => {
                  if (exercise.exerciseId !== exerciseId) {
                    return exercise;
                  }

                  const filtered = exercise.sets
                    .filter((set) => set.setNumber !== setNumber)
                    .map((set, index) => ({ ...set, setNumber: index + 1 }));

                  return {
                    ...exercise,
                    targetSets: filtered.length,
                    sets: filtered
                  };
                })
              }
            : null,
          dirty: true
        }));
        queueAutosave();
      },
      duplicatePreviousSet: (exerciseId, setNumber) => {
        set((state) => ({
          draft: state.draft
            ? {
                ...state.draft,
                exercises: mapExercises(state.draft.exercises, (exercise) => {
                  if (exercise.exerciseId !== exerciseId) {
                    return exercise;
                  }

                  const previous = exercise.sets.find((set) => set.setNumber === setNumber);

                  if (!previous) {
                    return exercise;
                  }

                  const cloned: SessionExerciseSet = {
                    ...previous,
                    id: undefined,
                    setNumber: exercise.sets.length + 1,
                    isCompleted: false,
                    completedReps: null,
                    completedWeightKg: null,
                    completedDurationSec: null
                  };

                  return {
                    ...exercise,
                    targetSets: exercise.targetSets + 1,
                    sets: [...exercise.sets, cloned]
                  };
                })
              }
            : null,
          dirty: true
        }));
        queueAutosave();
      },
      autoFillPreviousWeight: (exerciseId, setNumber) => {
        set((state) => ({
          draft: state.draft
            ? {
                ...state.draft,
                exercises: mapExercises(state.draft.exercises, (exercise) => {
                  if (exercise.exerciseId !== exerciseId) {
                    return exercise;
                  }

                  const target = exercise.sets.find((set) => set.setNumber === setNumber);
                  const previous = exercise.sets
                    .filter((set) => set.setNumber < setNumber && set.completedWeightKg)
                    .sort((a, b) => b.setNumber - a.setNumber)[0];

                  if (!target || !previous) {
                    return exercise;
                  }

                  return {
                    ...exercise,
                    sets: exercise.sets.map((set) =>
                      set.setNumber === setNumber
                        ? { ...set, targetWeightKg: previous.completedWeightKg }
                        : set
                    )
                  };
                })
              }
            : null,
          dirty: true
        }));
        queueAutosave();
      },
      updateSet: (exerciseId, setNumber, patch) => {
        set((state) => ({
          draft: state.draft
            ? {
                ...state.draft,
                exercises: mapExercises(state.draft.exercises, (exercise) => {
                  if (exercise.exerciseId !== exerciseId) {
                    return exercise;
                  }

                  return {
                    ...exercise,
                    sets: exercise.sets.map((set) =>
                      set.setNumber === setNumber ? { ...set, ...patch } : set
                    )
                  };
                })
              }
            : null,
          dirty: true
        }));
        queueAutosave();
      },
      markSetCompleted: (exerciseId, setNumber, completed) => {
        set((state) => ({
          draft: state.draft
            ? {
                ...state.draft,
                exercises: mapExercises(state.draft.exercises, (exercise) => {
                  if (exercise.exerciseId !== exerciseId) {
                    return exercise;
                  }

                  return {
                    ...exercise,
                    sets: exercise.sets.map((set) =>
                      set.setNumber === setNumber ? { ...set, isCompleted: completed } : set
                    )
                  };
                })
              }
            : null,
          dirty: true
        }));
        queueAutosave();
      },
      setStatus: (status) => {
        set((state) => ({
          draft: state.draft ? { ...state.draft, status } : null,
          dirty: true
        }));
        queueAutosave();
      },
      setDuration: (seconds) => {
        set((state) => ({
          draft: state.draft ? { ...state.draft, durationSeconds: seconds } : null,
          dirty: true
        }));
        queueAutosave();
      },
      saveNow: async () => {
        const draft = get().draft;

        if (!draft) {
          return;
        }

        try {
          await saveSessionDraft(draft);
          set({ dirty: false, lastSavedAt: new Date().toISOString() });
        } catch {
          await addPendingMutation({
            id: `${draft.sessionId}-${Date.now()}`,
            endpoint: `/api/workouts/sessions/${draft.sessionId}/sets`,
            method: "POST",
            payload: {
              sets: draft.exercises.flatMap((exercise) => exercise.sets),
              durationSeconds: draft.durationSeconds,
              notes: draft.notes,
              status: draft.status,
              disciplineScore: draft.disciplineScore,
              recoveryWarning: draft.recoveryWarning
            },
            createdAt: Date.now()
          });
        }
      }
    }),
    {
      name: "pulseforge-session-cache",
      partialize: (state) => ({
        draft: state.draft,
        lastSavedAt: state.lastSavedAt
      })
    }
  )
);

function queueAutosave() {
  if (saveTimer) {
    clearTimeout(saveTimer);
  }

  saveTimer = setTimeout(() => {
    void useSessionStore.getState().saveNow();
  }, 700);
}
