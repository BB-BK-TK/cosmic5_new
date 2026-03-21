"use client";

import { GlassCard } from "@/components/glass-card";
import { CosmicSectionLabel } from "@/components/ui/cosmic-section-label";
import type { DecisionCriterion } from "@/lib/decision-criteria";
import { cn } from "@/lib/utils";

interface DecisionCriteriaProps {
  items: DecisionCriterion[];
  className?: string;
}

export function DecisionCriteria({ items, className }: DecisionCriteriaProps) {
  if (!items.length) return null;
  return (
    <div className={cn("space-y-3", className)}>
      <CosmicSectionLabel>오늘의 선택 기준</CosmicSectionLabel>
      <div className="space-y-3">
        {items.map((item, i) => (
          <GlassCard key={i} className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg" aria-hidden>
                {item.icon}
              </span>
              <h3 className="text-sm font-medium text-text-primary">{item.question}</h3>
            </div>
            <p className="text-sm leading-relaxed text-text-secondary">{item.answer}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
