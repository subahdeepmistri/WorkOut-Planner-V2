"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface BodyFocusDatum {
  focus: string;
  value: number;
}

interface BodyFocusChartProps {
  data: BodyFocusDatum[];
}

export function BodyFocusChart({ data }: BodyFocusChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
          <XAxis dataKey="focus" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="hsl(var(--secondary))" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
