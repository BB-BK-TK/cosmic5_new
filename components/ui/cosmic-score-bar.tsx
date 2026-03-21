"use client";

import { cn } from "@/lib/utils";

interface CosmicScoreBarProps {
  value: number;
  max?: number;
  className?: string;
}

/** 1–5 (or custom max) horizontal bar using design accent gradient. */
export function CosmicScoreBar({ value, max = 5, className }: CosmicScoreBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-secondary/80", className)}>
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{
          width: `${pct}%`,
          background: "linear-gradient(90deg, var(--accent-purple), var(--accent-teal))",
        }}
      />
    </div>
  );
}
