import Link from "next/link";
import { Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureGateCalloutProps {
  title: string;
  description: string;
}

export function FeatureGateCallout({ title, description }: FeatureGateCalloutProps) {
  return (
    <Card className="border-primary/60 bg-primary/10">
      <CardContent className="flex items-start gap-3">
        <Lock className="mt-0.5 h-4 w-4 text-primary" />
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-sm text-foreground/70">{description}</p>
          <Link href="/billing" className="mt-2 inline-flex text-sm font-semibold text-primary">
            Upgrade to Pro
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
