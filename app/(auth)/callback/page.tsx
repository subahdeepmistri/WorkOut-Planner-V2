import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CallbackInfoPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication callback</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/70">
          This route is handled automatically. Continue to the dashboard once your session is ready.
        </p>
        <Link href="/dashboard" className="mt-3 inline-flex text-sm font-semibold text-primary">
          Continue to dashboard
        </Link>
      </CardContent>
    </Card>
  );
}
