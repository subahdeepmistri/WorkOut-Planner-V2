"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

interface VolumePoint {
  label: string;
  volume: number;
}

interface VolumeTrendChartProps {
  data: VolumePoint[];
}

export function VolumeTrendChart({ data }: VolumeTrendChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip cursor={{ fill: "hsl(var(--muted) / 0.5)" }} />
          <Area type="monotone" dataKey="volume" stroke="hsl(var(--primary))" fill="url(#volumeFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
