import { requireServerViewer } from "@/lib/auth";
import { AppShell } from "@/components/layout/app-shell";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  await requireServerViewer();
  return <AppShell>{children}</AppShell>;
}
