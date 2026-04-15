"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReportExportButton() {
  const [loading, setLoading] = useState(false);

  async function exportReport() {
    setLoading(true);

    const response = await fetch("/api/reports/export");
    const payload = await response.json();

    const blob = new Blob([JSON.stringify(payload.data ?? payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `pulseforge-report-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);

    setLoading(false);
  }

  return (
    <Button variant="outline" onClick={exportReport} disabled={loading}>
      <Download className="mr-2 h-4 w-4" />
      {loading ? "Exporting..." : "Export report"}
    </Button>
  );
}
