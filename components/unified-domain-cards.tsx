"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/glass-card";
import { ScoreStars } from "@/components/ui/score-stars";
import { CosmicSectionLabel } from "@/components/ui/cosmic-section-label";
import { cn } from "@/lib/utils";
import type { UnifiedDomain } from "@/types/unified-domain";

interface UnifiedDomainCardsProps {
  domains: UnifiedDomain[];
  className?: string;
}

export function UnifiedDomainCards({ domains, className }: UnifiedDomainCardsProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  useEffect(() => {
    setOpenId(null);
  }, [domains]);
  if (!domains.length) return null;

  return (
    <div className={cn("space-y-3", className)}>
      <CosmicSectionLabel>생활 영역 통합</CosmicSectionLabel>
      <div className="space-y-3">
        {domains.map((d) => {
          const open = openId === d.id;
          return (
            <GlassCard key={d.id} className="overflow-hidden p-0">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : d.id)}
                className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-glass-bg/50"
              >
                <span className="text-xl" aria-hidden>
                  {d.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-medium text-text-primary">{d.area}</h3>
                    <ScoreStars value={d.score} max={5} />
                  </div>
                  <p className="mt-2 text-xs text-text-muted line-clamp-2">{d.summary}</p>
                </div>
                <span className="text-text-muted">{open ? "−" : "+"}</span>
              </button>
              {open && (
                <div className="space-y-3 border-t border-glass-border px-4 pb-4 pt-3 animate-in fade-in duration-200">
                  <div className="rounded-xl border border-accent-purple/20 bg-accent-purple/5 p-3">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-accent-purple">
                      별자리 관점
                    </p>
                    <p className="text-sm leading-relaxed text-text-secondary">{d.astroDetail}</p>
                  </div>
                  <div className="rounded-xl border border-accent-teal/20 bg-accent-teal/5 p-3">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-accent-teal">
                      사주 관점
                    </p>
                    <p className="text-sm leading-relaxed text-text-secondary">{d.sajuDetail}</p>
                  </div>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
