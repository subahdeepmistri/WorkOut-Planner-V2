import { SessionExercise } from "@/modules/workout/types/session-client";
import { ExerciseCard } from "@/components/workout/exercise-card";

interface BlockSectionProps {
  title: string;
  subtitle: string;
  exercises: SessionExercise[];
}

export function BlockSection({ title, subtitle, exercises }: BlockSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/70">{subtitle}</span>
      </div>
      <div className="space-y-3">
        {exercises.map((exercise) => (
          <ExerciseCard key={exercise.exerciseId} exercise={exercise} />
        ))}
      </div>
    </section>
  );
}
