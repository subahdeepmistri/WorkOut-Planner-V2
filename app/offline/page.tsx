import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-3 px-5 text-center">
      <WifiOff className="h-10 w-10 text-primary" />
      <h1 className="text-2xl font-bold">You are offline</h1>
      <p className="text-sm text-foreground/70">
        PulseForge will keep autosaving your sets locally and sync when you reconnect.
      </p>
    </div>
  );
}
