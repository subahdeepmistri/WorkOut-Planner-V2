"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Bolt, CalendarClock, Dumbbell, Settings, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Bolt },
  { href: "/session/new", label: "Session", icon: Dumbbell },
  { href: "/history", label: "History", icon: CalendarClock },
  { href: "/records", label: "Records", icon: Trophy },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings }
];

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-24 pt-4 sm:px-8 sm:pt-8">
      <main className="flex-1">{children}</main>
      <nav className="fixed bottom-4 left-1/2 z-40 flex w-[min(95vw,760px)] -translate-x-1/2 gap-1 rounded-2xl border border-border/70 bg-card/95 p-2 shadow-premium backdrop-blur">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition",
                active ? "bg-primary text-white" : "text-foreground/70 hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
