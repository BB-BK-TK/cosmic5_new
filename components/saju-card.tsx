"use client";

import { GlassCard } from "./glass-card";
import { cn } from "@/lib/utils";

interface SajuData {
  pillars: {
    type: string;
    korean: string;
    hanja: string;
    animal: string;
  }[];
  dayMaster: {
    hanja: string;
    korean: string;
    meaning: string;
  };
  strengths: string[];
  cautions: string[];
}

interface SajuCardProps {
  data: SajuData;
}

export function SajuCard({ data }: SajuCardProps) {
  return (
    <GlassCard badge={{ label: "四柱 Saju", variant: "teal" }}>
      {/* Four Pillars */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {data.pillars.map((pillar) => (
          <div
            key={pillar.type}
            className={cn(
              "flex flex-col items-center py-4 px-2 rounded-xl",
              "bg-secondary/50"
            )}
          >
            <span className="text-xs text-text-muted mb-2">{pillar.type}</span>
            <span className="text-lg text-accent-teal mb-1">{pillar.hanja}</span>
            <span className="text-xs text-text-secondary mb-2">
              {pillar.korean}
            </span>
            <span className="text-lg">{pillar.animal}</span>
          </div>
        ))}
      </div>

      {/* Day Master */}
      <div className="bg-secondary/30 rounded-xl p-4 mb-6">
        <p className="text-sm text-text-primary">
          <span className="text-accent-gold">일간:</span>{" "}
          <span className="text-accent-teal">{data.dayMaster.hanja}</span>{" "}
          <span className="text-text-secondary">({data.dayMaster.korean})</span>{" "}
          - {data.dayMaster.meaning}
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-glass-border mb-6" />

      {/* Strengths */}
      <div className="mb-4">
        <h3 className="text-sm text-text-primary mb-3 flex items-center gap-2">
          <span>💪</span> 강점
        </h3>
        <div className="space-y-2">
          {data.strengths.map((strength, index) => (
            <p
              key={index}
              className="text-sm text-text-secondary flex items-start gap-2"
            >
              <span className="text-positive mt-0.5">•</span>
              {strength}
            </p>
          ))}
        </div>
      </div>

      {/* Cautions */}
      <div>
        <h3 className="text-sm text-text-primary mb-3 flex items-center gap-2">
          <span>⚠️</span> 주의
        </h3>
        <div className="space-y-2">
          {data.cautions.map((caution, index) => (
            <p
              key={index}
              className="text-sm text-text-secondary flex items-start gap-2"
            >
              <span className="text-caution mt-0.5">•</span>
              {caution}
            </p>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
