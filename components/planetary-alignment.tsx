"use client";

import { cn } from "@/lib/utils";

interface PlanetaryAlignmentProps {
  sunSign: string;
  moonSign: string;
  risingSign: string;
  className?: string;
}

/** Decorative orbit diagram + big three labels (prototype parity). */
export function PlanetaryAlignment({
  sunSign,
  moonSign,
  risingSign,
  className,
}: PlanetaryAlignmentProps) {
  return (
    <div
      className={cn(
        "relative mb-6 overflow-hidden rounded-2xl border border-glass-border bg-secondary/30 p-4",
        className
      )}
    >
      <p className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-text-muted">
        행성 배치
      </p>
      <div className="relative mx-auto aspect-[4/3] max-h-[200px] w-full max-w-[280px]">
        <svg viewBox="0 0 200 160" className="h-full w-full" aria-hidden>
          <defs>
            <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-purple)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--accent-teal)" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <ellipse
            cx="100"
            cy="80"
            rx="78"
            ry="52"
            fill="none"
            stroke="url(#orbitGrad)"
            strokeWidth="0.5"
            opacity="0.6"
          />
          <ellipse
            cx="100"
            cy="80"
            rx="52"
            ry="34"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.5"
          />
          <ellipse
            cx="100"
            cy="80"
            rx="28"
            ry="18"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.5"
          />
          <circle cx="100" cy="80" r="6" fill="var(--accent-gold)" opacity="0.9" />
          <circle cx="145" cy="62" r="4" fill="var(--accent-purple)" />
          <circle cx="58" cy="95" r="3.5" fill="var(--accent-teal)" />
        </svg>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[11px] text-text-secondary">
        <div>
          <span className="text-accent-gold">☉</span>
          <div className="truncate text-text-primary">{sunSign}</div>
        </div>
        <div>
          <span className="text-accent-purple">☽</span>
          <div className="truncate text-text-primary">{moonSign || "—"}</div>
        </div>
        <div>
          <span className="text-accent-teal">↑</span>
          <div className="truncate text-text-primary">{risingSign || "—"}</div>
        </div>
      </div>
    </div>
  );
}
