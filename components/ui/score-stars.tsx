"use client";

import { cn } from "@/lib/utils";

interface ScoreStarsProps {
  /** 채울 별 개수 (분자). */
  value: number;
  /** 최대 별 개수 (분모). 기본 5. */
  max?: number;
  className?: string;
}

/**
 * max개 별 중 value개는 채움(★), 나머지는 비움(☆).
 */
export function ScoreStars({ value, max = 5, className }: ScoreStarsProps) {
  const capped = Math.round(Math.min(max, Math.max(0, value)));
  const label = `별점 ${capped}점, 만점 ${max}점`;

  return (
    <div
      className={cn("flex shrink-0 items-center gap-0.5", className)}
      role="img"
      aria-label={label}
    >
      {Array.from({ length: max }, (_, i) => {
        const filled = i < capped;
        return (
          <span
            key={i}
            className={cn(
              "text-base leading-none select-none",
              filled ? "text-accent-gold drop-shadow-[0_0_6px_rgba(201,168,124,0.35)]" : "text-text-muted/30"
            )}
            aria-hidden
          >
            {filled ? "★" : "☆"}
          </span>
        );
      })}
    </div>
  );
}
