"use client";

import { ErrorFallback } from "@/components/layout/error-fallback";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return <ErrorFallback reset={reset} />;
}
