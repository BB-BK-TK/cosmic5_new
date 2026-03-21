"use client";

import { cn } from "@/lib/utils";

const TABS = ["통합 해석", "별자리 분석", "사주 분석"] as const;

interface AnalysisTabNavProps {
  activeIndex: number;
  onChange: (index: number) => void;
  className?: string;
}

export function AnalysisTabNav({ activeIndex, onChange, className }: AnalysisTabNavProps) {
  return (
    <nav
      className={cn(
        "sticky top-0 z-20 -mx-5 mb-6 border-b border-glass-border bg-background/75 px-5 py-2 backdrop-blur-xl",
        className
      )}
      aria-label="분석 탭"
    >
      <div className="flex gap-1 rounded-xl bg-secondary/40 p-1">
        {TABS.map((label, i) => {
          const active = i === activeIndex;
          return (
            <button
              key={label}
              type="button"
              onClick={() => onChange(i)}
              className={cn(
                "flex-1 rounded-lg py-2.5 text-center text-xs font-medium transition-all duration-200",
                active
                  ? "bg-glass-bg text-text-primary shadow-[0_0_20px_rgba(155,138,255,0.12)] border border-glass-border"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
