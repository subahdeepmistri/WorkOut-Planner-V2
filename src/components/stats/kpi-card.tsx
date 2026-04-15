import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
}

export function KpiCard({ label, value, delta }: KpiCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-foreground/70">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
        {delta ? <p className="text-xs text-success">{delta}</p> : null}
      </CardContent>
    </Card>
  );
}
