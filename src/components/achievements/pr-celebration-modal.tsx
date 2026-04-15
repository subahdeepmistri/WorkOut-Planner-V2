"use client";

import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface PrCelebrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  value: string;
}

export function PrCelebrationModal({ open, onOpenChange, title, value }: PrCelebrationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Trophy className="h-5 w-5 text-accent" />
            New Personal Record
          </DialogTitle>
          <DialogDescription>
            {title} reached {value}. Keep this momentum and push the next milestone.
          </DialogDescription>
        </DialogHeader>
        <Button onClick={() => onOpenChange(false)}>Let&apos;s Go</Button>
      </DialogContent>
    </Dialog>
  );
}
