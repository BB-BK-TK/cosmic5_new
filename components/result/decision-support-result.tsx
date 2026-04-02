"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/glass-card";
import type { ResultViewModel, AstrologyPeriodKey } from "@/types/result-schema";
import { IntegratedInsightCard } from "@/components/integrated-insight-card";
import { UnifiedDomainCards } from "@/components/unified-domain-cards";
import { WhyThisResult } from "@/components/result";
import { MicroActionCard } from "@/components/micro-action-card";

export function DecisionSupportResult(props: {
  viewModel: ResultViewModel;
  period: AstrologyPeriodKey;
  integratedDisplay: {
    commonTheme: string;
    cautionSignal: string;
    dailyGuideline: string;
    lifetimeTheme?: string;
    integratedStrength?: string;
  };
  decisionItems: { icon: string; question: string; answer: string }[];
  unifiedDomains: Parameters<typeof UnifiedDomainCards>[0]["domains"];
  onSaveToday?: () => void;
  onSeeTomorrow?: () => void;
  onShare?: () => void;
  className?: string;
}) {
  const astro = props.viewModel.astrology.byPeriod[props.period];
  const facts = astro?.interpretationFacts;

  const oneLine = props.viewModel.heroSummary.message;
  const flow = useMemo(() => {
    const energy = facts?.energy?.trim();
    const weak =
      facts && typeof facts.healthScore === "number"
        ? weakestDomain(facts)
        : null;
    if (!energy) return "오늘의 흐름을 짧게 정리하고, 바로 실행으로 연결해 드릴게요.";
    if (!weak) return `오늘의 키워드는 「${energy}」예요. 과하게 밀어붙이기보다 리듬을 잘 타는 쪽이 유리합니다.`;
    return `오늘의 키워드는 「${energy}」예요. 특히 ${weak.label} 쪽에서 에너지 소모가 커질 수 있어, 결정은 ‘작게·빠르게’가 좋아요.`;
  }, [facts]);

  const category = useMemo(() => {
    if (!facts) {
      return {
        emotion: "감정이 올라오면 속도를 늦추고, 한 번 더 확인하고 움직이세요.",
        relationship: "말은 짧게·정확하게. 기대를 줄이면 만족이 커집니다.",
        work: "오늘은 시작보다 ‘마무리’에 점수를 주세요.",
      };
    }
    return {
      emotion: `기운은 ${facts.energy} 쪽으로 기울어요. 감정이 커질수록 ‘지금 결론’보다 ‘한 번 보류’가 이득입니다.`,
      relationship: `연애·관계는 ${facts.loveStatus} 흐름. 설득보다 확인 질문 1개가 더 잘 먹혀요.`,
      work: `커리어는 ${facts.careerStatus} 흐름. 한 번에 한 가지를 끝내는 쪽이 성과로 연결됩니다.`,
    };
  }, [facts]);

  const actions = useMemo(() => {
    // Keep it concrete; we already have MicroActionCard (interactive). This is “2–3 actions” as a quick list.
    const list: { title: string; text: string }[] = [];
    if (facts?.luckyTime && facts.luckyTime !== "—") {
      list.push({
        title: "타이밍",
        text: `중요한 결정을 ${facts.luckyTime} 쪽으로 미루면 리스크가 줄어듭니다.`,
      });
    } else {
      list.push({
        title: "타이밍",
        text: "중요한 대화/결정은 ‘지금’이 아니라 ‘조금 뒤’로 미루는 편이 안전합니다.",
      });
    }
    list.push({
      title: "행동",
      text: "새로 시작하기보다, 미완료 1개를 끝내서 ‘열린 루프’를 닫아 주세요.",
    });
    if (facts?.bodyPart && facts.bodyPart !== "—") {
      list.push({
        title: "컨디션",
        text: `${facts.bodyPart} 쪽은 과부하가 오기 쉬워요. 10분만이라도 가볍게 풀어 주세요.`,
      });
    } else {
      list.push({
        title: "컨디션",
        text: "휴식 한 번을 ‘선택지’가 아니라 ‘일정’으로 잡아 두면 하루가 안정됩니다.",
      });
    }
    return list.slice(0, 3);
  }, [facts]);

  return (
    <div className={cn("space-y-6", props.className)}>
      {/* [1] One-line summary */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-muted">
            Today’s decision summary
          </p>
          <h2 className="mt-2 text-balance text-[1.35rem] font-semibold leading-snug tracking-tight text-text-primary">
            {oneLine}
          </h2>
          {props.viewModel.heroSummary.luckyLine && (
            <p className="mt-4 rounded-2xl border border-accent-teal/25 bg-accent-teal/[0.08] px-4 py-3 text-sm font-medium text-accent-teal/95">
              ✦ {props.viewModel.heroSummary.luckyLine}
            </p>
          )}
        </div>
        <div className="border-t border-glass-border bg-secondary/10 px-6 py-4">
          {/* [2] Flow explanation */}
          <p className="text-sm leading-relaxed text-text-secondary">{flow}</p>
        </div>
      </GlassCard>

      {/* [3] Category insights */}
      <div className="grid gap-3">
        <MiniInsight label="Emotion" title="감정" text={category.emotion} />
        <MiniInsight label="Relationship" title="관계" text={category.relationship} />
        <MiniInsight label="Work" title="일" text={category.work} />
      </div>

      {/* [4] Action recommendations */}
      <GlassCard>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
          What to do today
        </p>
        <h3 className="mt-2 text-base font-semibold text-text-primary">오늘 바로 할 수 있는 3가지</h3>
        <div className="mt-4 grid gap-3">
          {actions.map((a, i) => (
            <div
              key={i}
              className="rounded-2xl border border-glass-border bg-secondary/20 p-4"
            >
              <p className="text-xs font-semibold text-accent-purple">{a.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary">{a.text}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Deeper cards (still useful, but below the “do” layer) */}
      <IntegratedInsightCard data={props.integratedDisplay} criteria={props.decisionItems} />
      <UnifiedDomainCards domains={props.unifiedDomains} />

      {/* [5] Why this result */}
      <WhyThisResult
        basedOn={props.viewModel.whyThisResult.basedOn}
        sections={props.viewModel.whyThisResult.sections}
      />

      {/* [6] Interaction layer */}
      <GlassCard className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
          Actions
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          <ActionButton label="Save today" sub="오늘을 저장" onClick={props.onSaveToday} />
          <ActionButton label="See tomorrow" sub="내일 보기" onClick={props.onSeeTomorrow} />
          <ActionButton label="Share" sub="공유" onClick={props.onShare} />
        </div>
        <p className="text-xs text-text-muted">
          저장해두면 7일 패턴에서 “오늘의 선택”이 어떻게 누적되는지 보여줄 수 있어요.
        </p>
      </GlassCard>

      {/* Retention loop: recent 7-day pattern (lightweight v1) */}
      <RecentPattern7 viewModel={props.viewModel} period={props.period} />

      {/* MicroActionCard keeps engagement and “completion loop” */}
      <MicroActionCard actions={props.viewModel.microActions} />
    </div>
  );
}

function MiniInsight(props: { label: string; title: string; text: string }) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-text-primary">{props.title}</p>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-muted">
          {props.label}
        </p>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{props.text}</p>
    </GlassCard>
  );
}

function ActionButton(props: { label: string; sub: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={cn(
        "rounded-2xl border border-glass-border bg-secondary/20 px-4 py-4 text-left",
        "transition-colors hover:border-glass-highlight hover:bg-secondary/30"
      )}
    >
      <p className="text-sm font-semibold text-text-primary">{props.label}</p>
      <p className="mt-1 text-xs text-text-muted">{props.sub}</p>
    </button>
  );
}

function weakestDomain(f: NonNullable<ResultViewModel["astrology"]["byPeriod"][AstrologyPeriodKey]>["interpretationFacts"]) {
  const rows = [
    { key: "love", score: f.loveScore, label: "관계" },
    { key: "career", score: f.careerScore, label: "일" },
    { key: "money", score: f.moneyScore, label: "재물" },
    { key: "health", score: f.healthScore, label: "컨디션" },
  ];
  let idx = 0;
  for (let i = 1; i < rows.length; i++) if (rows[i].score < rows[idx].score) idx = i;
  return rows[idx];
}

function RecentPattern7(props: { viewModel: ResultViewModel; period: AstrologyPeriodKey }) {
  const sign = props.viewModel.astrology.sunSign;
  const seed = Array.from(`${sign}:${new Date().toDateString()}`).reduce((a, c) => a + c.charCodeAt(0), 0);
  const bars = new Array(7).fill(0).map((_, i) => {
    const v = (seed * (i + 3) * 9301 + 49297) % 233280;
    return 2 + (v % 4); // 2..5
  });
  return (
    <GlassCard>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
          Recent 7-day pattern
        </p>
        <p className="text-xs text-text-muted">v1</p>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        최근 7일의 “리듬”을 한눈에 보고, 내일은 어디에 힘을 줄지 결정하세요.
      </p>
      <div className="mt-4 grid grid-cols-7 gap-2">
        {bars.map((v, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="h-16 w-full rounded-full bg-secondary/30 overflow-hidden border border-glass-border">
              <div
                className="w-full rounded-full"
                style={{
                  height: `${(v / 5) * 100}%`,
                  marginTop: `${(1 - v / 5) * 100}%`,
                  background: "linear-gradient(180deg, var(--accent-purple), var(--accent-teal))",
                }}
              />
            </div>
            <span className="text-[10px] text-text-muted">{i === 6 ? "Today" : `D-${6 - i}`}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-text-muted">
        (다음 단계) “감정 반복 패턴 / 이번 주 패턴”은 저장된 기록 기반으로 더 정확히 만들 수 있어요.
      </p>
    </GlassCard>
  );
}

