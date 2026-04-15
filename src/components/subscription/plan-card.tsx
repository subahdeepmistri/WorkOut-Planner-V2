import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlanCardProps {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
  ctaText: string;
  onSelect: () => void;
}

export function PlanCard({ name, price, features, highlighted, ctaText, onSelect }: PlanCardProps) {
  return (
    <Card className={highlighted ? "border-primary shadow-premium" : undefined}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {name}
          <span className="text-lg">{price}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              {feature}
            </li>
          ))}
        </ul>
        <Button className="mt-4 w-full" variant={highlighted ? "primary" : "outline"} onClick={onSelect}>
          {ctaText}
        </Button>
      </CardContent>
    </Card>
  );
}
