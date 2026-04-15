interface WeeklyHeatmapProps {
  values: number[];
}

export function WeeklyHeatmap({ values }: WeeklyHeatmapProps) {
  return (
    <div className="grid grid-cols-7 gap-1">
      {values.map((value, index) => {
        const intensity = Math.min(1, value / 100);

        return (
          <div
            key={index}
            className="h-8 rounded-md"
            style={{
              backgroundColor: `hsl(var(--primary) / ${0.1 + intensity * 0.8})`
            }}
            title={`${value} volume points`}
          />
        );
      })}
    </div>
  );
}
