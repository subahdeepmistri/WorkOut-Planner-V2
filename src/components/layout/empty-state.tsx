import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionText, onAction }: EmptyStateProps) {
  return (
    <div className="glass-card flex flex-col items-center justify-center gap-3 py-12 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="max-w-md text-sm text-foreground/70">{description}</p>
      {actionText && onAction ? (
        <Button variant="secondary" onClick={onAction}>
          {actionText}
        </Button>
      ) : null}
    </div>
  );
}
