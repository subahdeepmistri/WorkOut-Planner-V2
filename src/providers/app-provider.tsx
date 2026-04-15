"use client";

import { ReactNode, useEffect } from "react";
import { ThemeProvider } from "@/providers/theme-provider";
import { registerServiceWorker } from "@/lib/pwa/register-sw";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return <ThemeProvider>{children}</ThemeProvider>;
}
