"use client";

import { cn } from "@/lib/utils";

interface CosmicSectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function CosmicSectionLabel({ children, className }: CosmicSectionLabelProps) {
  return (
    <h2
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.2em] text-text-muted mb-3",
        className
      )}
    >
      {children}
    </h2>
  );
}
