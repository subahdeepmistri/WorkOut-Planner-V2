"use client";

import { useState } from "react";
import { PersonalRecord } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrCelebrationModal } from "@/components/achievements/pr-celebration-modal";

interface RecordsPanelProps {
  records: Array<PersonalRecord & { exerciseName: string }>;
}

export function RecordsPanel({ records }: RecordsPanelProps) {
  const [modalOpen, setModalOpen] = useState(true);
  const featuredRecord = records[0];

  return (
    <div className="space-y-3">
      {featuredRecord ? (
        <PrCelebrationModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          title={featuredRecord.exerciseName}
          value={`${featuredRecord.value}`}
        />
      ) : null}

      {records.map((record) => (
        <Card key={record.id}>
          <CardHeader>
            <CardTitle className="text-base">{record.exerciseName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{record.value}</p>
            <p className="text-sm text-foreground/70">{record.metric.replaceAll("_", " ")}</p>
          </CardContent>
        </Card>
      ))}

      {records.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-foreground/70">
            No personal records yet. Complete sessions to unlock PR celebrations.
          </CardContent>
        </Card>
      ) : null}

      {records.length > 0 ? (
        <Button variant="outline" onClick={() => setModalOpen(true)}>
          Replay PR celebration
        </Button>
      ) : null}
    </div>
  );
}
