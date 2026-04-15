import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportExportButton } from "@/components/stats/report-export-button";

export default function ReportsPage() {
  return (
    <div className="space-y-4 pb-20">
      <PageHeader title="Reports" subtitle="Export training history, progression records, and retention snapshots" />

      <Card>
        <CardHeader>
          <CardTitle>Cloud backups and export</CardTitle>
          <CardDescription>Generate JSON exports for backups, coach sharing, or migration.</CardDescription>
        </CardHeader>
        <CardContent>
          <ReportExportButton />
        </CardContent>
      </Card>
    </div>
  );
}
