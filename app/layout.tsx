import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/providers/app-provider";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "PulseForge Workout",
  description: "Premium workout tracking SaaS with progression analytics and monetization.",
  applicationName: "PulseForge Workout"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
