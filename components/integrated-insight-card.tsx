"use client";

import { GlassCard } from "./glass-card";
import { cn } from "@/lib/utils";

interface IntegratedInsightData {
  commonTheme: string;
  cautionSignal: string;
  dailyGuideline: string;
}

interface IntegratedInsightCardProps {
  data: IntegratedInsightData;
}

export function IntegratedInsightCard({ data }: IntegratedInsightCardProps) {
  return (
    <GlassCard badge={{ label: "통합 인사이트", variant: "gold" }}>
      {/* Common Theme */}
      <div className="mb-6">
        <h3 className="text-sm text-text-primary mb-3 flex items-center gap-2">
          <span className="text-accent-purple">🔗</span> 공통 테마
        </h3>
        <div
          className={cn(
            "p-4 rounded-xl",
            "bg-accent-purple/10 border border-accent-purple/20"
          )}
        >
          <p className="text-sm text-text-secondary leading-relaxed">
            {data.commonTheme}
          </p>
        </div>
      </div>

      {/* Caution Signal */}
      <div className="mb-6">
        <h3 className="text-sm text-text-primary mb-3 flex items-center gap-2">
          <span className="text-caution">⚡</span> 주의 신호
        </h3>
        <div
          className={cn(
            "p-4 rounded-xl",
            "bg-caution/10 border border-caution/20"
          )}
        >
          <p className="text-sm text-text-secondary leading-relaxed">
            {data.cautionSignal}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-glass-border mb-6" />

      {/* Daily Guideline */}
      <div>
        <h3 className="text-sm text-text-primary mb-3 flex items-center gap-2">
          <span className="text-accent-teal">📍</span> 오늘의 선택 기준
        </h3>
        <p
          className="text-base text-text-primary text-center py-4 leading-relaxed"
          style={{ fontFamily: "var(--font-cormorant), serif" }}
        >
          {`"${data.dailyGuideline}"`}
        </p>
      </div>
    </GlassCard>
  );
}
