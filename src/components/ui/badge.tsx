import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "default" | "success" | "danger" | "muted";
}

export function Badge({ tone = "default", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        {
          "bg-primary/15 text-primary": tone === "default",
          "bg-success/20 text-success": tone === "success",
          "bg-danger/20 text-danger": tone === "danger",
          "bg-muted text-foreground/70": tone === "muted"
        },
        className
      )}
      {...props}
    />
  );
}
