"use client";

import { GlassCard } from "./glass-card";
import { CosmicSectionLabel } from "@/components/ui/cosmic-section-label";
import type { DecisionCriterion } from "@/lib/decision-criteria";
import { cn } from "@/lib/utils";

interface IntegratedInsightData {
  commonTheme: string;
  cautionSignal: string;
  dailyGuideline: string;
  lifetimeTheme?: string;
  /** 통합 강점 — 없으면 lifetimeTheme 등으로 대체 */
  integratedStrength?: string;
}

interface IntegratedInsightCardProps {
  data: IntegratedInsightData;
  /** 통합 블록 아래에 이어서 표시 (오늘의 선택 기준 Q&A). */
  criteria?: DecisionCriterion[];
}

const cardShell =
  "rounded-xl border p-4 text-left transition-colors duration-300 hover:border-glass-highlight";

export function IntegratedInsightCard({ data, criteria }: IntegratedInsightCardProps) {
  const strength =
    data.integratedStrength?.trim() ||
    data.lifetimeTheme?.trim() ||
    "오행과 별자리의 조화 속에서, 오늘의 리듬을 자연스럽게 타 보세요.";

  const hasCriteria = criteria && criteria.length > 0;

  return (
    <div className="space-y-3">
      <CosmicSectionLabel>통합 인사이트 · 오늘의 선택 기준</CosmicSectionLabel>
      <GlassCard className="space-y-4">
        {/* 공통 테마 */}
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent-purple">
            공통 테마
          </h3>
          <div className={cn(cardShell, "border-accent-purple/25 bg-accent-purple/[0.06]")}>
            <p className="text-sm leading-relaxed text-text-secondary">
              {data.commonTheme || "오늘의 에너지를 살려보세요."}
            </p>
          </div>
        </div>

        {/* 통합 주의사항 */}
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-caution">
            통합 주의사항
          </h3>
          <div className={cn(cardShell, "border-caution/25 bg-caution/[0.06]")}>
            <p className="text-sm leading-relaxed text-text-secondary">
              {data.cautionSignal || "무리하지 않는 것이 좋아요."}
            </p>
          </div>
        </div>

        {/* 통합 강점 */}
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent-teal">
            통합 강점
          </h3>
          <div className={cn(cardShell, "border-accent-teal/25 bg-accent-teal/[0.06]")}>
            <p className="text-sm leading-relaxed text-text-secondary">{strength}</p>
          </div>
        </div>

        {hasCriteria && (
          <>
            <div className="h-px bg-glass-border" />
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                오늘의 선택 기준
              </h3>
              <div className="space-y-3">
                {criteria!.map((item, i) => (
                  <div
                    key={i}
                    className={cn(
                      cardShell,
                      "border-glass-border bg-secondary/20 py-3"
                    )}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg" aria-hidden>
                        {item.icon}
                      </span>
                      <h4 className="text-sm font-medium text-text-primary">{item.question}</h4>
                    </div>
                    <p className="text-sm leading-relaxed text-text-secondary pl-8">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </GlassCard>
    </div>
  );
}
