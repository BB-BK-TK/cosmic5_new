"use client";

import { useMemo, useState } from "react";
import { GlassCard } from "./glass-card";
import { PlanetaryAlignment } from "@/components/planetary-alignment";
import { cn } from "@/lib/utils";

interface AstrologyData {
  sunSign: string;
  moonSign: string;
  risingSign: string;
  planets: {
    name: string;
    symbol: string;
    sign: string;
    house: number;
  }[];
  /** Phase 3: per-sign interpretation */
  personality?: string;
  strengthsText?: string;
  cautionsText?: string;
  luckySummary?: string;
}

interface AstrologyCardProps {
  data: AstrologyData;
}

export function AstrologyCard({ data }: AstrologyCardProps) {
  const [learnOpen, setLearnOpen] = useState(false);

  const sign = (data.sunSign || "").trim();
  const hero = useMemo(() => buildAstroHero(sign), [sign]);

  const why = useMemo(() => {
    const parts: string[] = [];
    if (data.sunSign) parts.push(`태양이 ${data.sunSign}`);
    if (data.moonSign && data.moonSign !== "정보 부족" && data.moonSign !== "—") parts.push(`달이 ${data.moonSign}`);
    if (data.risingSign && data.risingSign !== "출생시간 필요" && data.risingSign !== "정보 부족" && data.risingSign !== "—") {
      parts.push(`상승이 ${data.risingSign}`);
    }
    const line1 = parts.length ? `당신의 핵심 축은 ${parts.join(" · ")}로 잡혀 있어요.` : "당신의 핵심 축(태양·달·상승)을 바탕으로 오늘의 흐름을 읽어요.";
    const line2 =
      "이 조합이 ‘무엇을 중요하게 느끼는지(태양) / 어떻게 반응하는지(달) / 어떻게 보이는지(상승)’의 패턴을 만들어요.";
    return { line1, line2 };
  }, [data.sunSign, data.moonSign, data.risingSign]);

  const realLife = useMemo(() => {
    const base = hero.realLife;
    const extra = data.personality?.trim() ? [`한 줄 성향: ${data.personality.trim()}`] : [];
    return [...base, ...extra].slice(0, 6);
  }, [hero.realLife, data.personality]);

  const actionGuide = useMemo(() => {
    const intro = hero.actionIntro;
    const items = [...hero.actionItems];
    // If we have lucky summary, pull one concrete hint.
    if (data.luckySummary?.trim()) {
      items[0] = `행운 포인트를 오늘 일정에 실제로 반영해 보세요. ${data.luckySummary.trim()}`;
    }
    return { intro, items: items.slice(0, 3) };
  }, [hero.actionIntro, hero.actionItems, data.luckySummary]);

  return (
    <GlassCard badge={{ label: "Astrology", variant: "purple" }}>
      {/* 1) Hero insight */}
      <div className="relative overflow-hidden rounded-2xl border border-glass-border bg-secondary/20 p-5">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 20% 0%, rgba(155, 138, 255, 0.12) 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(94, 220, 183, 0.06) 0%, transparent 50%)",
          }}
        />
        <div className="relative z-10">
          <div className="mb-2 flex justify-center">
            <span className="rounded-full border border-accent-purple/25 bg-accent-purple/[0.10] px-3 py-1 text-xs font-medium text-accent-purple/95">
              {hero.badge}
            </span>
          </div>
          <h2 className="text-balance text-center text-[1.2rem] font-semibold leading-snug tracking-tight text-text-primary">
            {hero.headline}
          </h2>
          <p className="mt-2 text-center text-sm leading-relaxed text-text-secondary">
            {hero.supporting}
          </p>
        </div>
      </div>

      {/* 2) Why this reading appears */}
      <div className="mt-4 rounded-2xl border border-glass-border bg-secondary/10 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
          Why this reading appears
        </p>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          {why.line1}
          <br />
          {why.line2}
        </p>
      </div>

      {/* 3) Big 3 visual (keep, but not leading) */}
      <div className="mt-4">
        <PlanetaryAlignment sunSign={data.sunSign} moonSign={data.moonSign} risingSign={data.risingSign} />
      </div>

      {/* 4) Real-life patterns */}
      <div className="mt-5 rounded-2xl border border-glass-border bg-secondary/10 p-5">
        <h3 className="text-sm font-semibold text-text-primary">현실에서는 이렇게 드러나요</h3>
        <div className="mt-3 space-y-2">
          {realLife.map((t, i) => (
            <p key={i} className="text-sm leading-relaxed text-text-secondary">
              <span className="mr-2 text-accent-purple">✦</span>
              {t}
            </p>
          ))}
        </div>
      </div>

      {/* 5) Strengths + cautions */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <GlassCard className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Strengths</p>
          <h3 className="mt-2 text-sm font-semibold text-text-primary">강점</h3>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            {data.strengthsText?.trim() || hero.strengthFallback}
          </p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Cautions</p>
          <h3 className="mt-2 text-sm font-semibold text-text-primary">주의 포인트</h3>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            {data.cautionsText?.trim() || hero.cautionFallback}
          </p>
        </GlassCard>
      </div>

      {/* 6) Action guide */}
      <div className="mt-5 rounded-2xl border border-accent-purple/25 bg-accent-purple/[0.06] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-purple/95">
          Action guide
        </p>
        <h3 className="mt-2 text-sm font-semibold text-text-primary">오늘의 행동 가이드</h3>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">{actionGuide.intro}</p>
        <div className="mt-3 space-y-2">
          {actionGuide.items.map((t, i) => (
            <div key={i} className="rounded-2xl border border-glass-border bg-secondary/10 px-4 py-3">
              <p className="text-sm leading-relaxed text-text-secondary">
                <span className="mr-2 text-accent-purple">→</span>
                {t}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 7) Learn more (progressive disclosure) */}
      <div className="mt-5">
        <button
          type="button"
          onClick={() => setLearnOpen((v) => !v)}
          className={cn(
            "flex w-full items-center justify-between rounded-2xl border border-glass-border bg-secondary/10 px-4 py-4 text-left",
            "transition-colors hover:border-glass-highlight"
          )}
        >
          <div>
            <p className="text-sm font-semibold text-text-primary">핵심 행성 / 하우스 더 알아보기</p>
            <p className="mt-1 text-xs text-text-muted">필요할 때만 열어보세요 (핵심은 위 해석/가이드입니다)</p>
          </div>
          <span className="text-lg text-accent-purple">{learnOpen ? "−" : "+"}</span>
        </button>

        {learnOpen && (
          <div className="mt-3 space-y-3">
            <GlassCard className="p-5">
              <h4 className="text-sm font-semibold text-text-primary">핵심 행성</h4>
              {data.planets && data.planets.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {data.planets.map((planet, index) => (
                    <div
                      key={`${planet.name}-${index}`}
                      className="flex items-center text-sm text-text-primary"
                    >
                      <span className="text-accent-purple mr-2">
                        {index === data.planets.length - 1 ? "└" : "├"}
                      </span>
                      <span className="text-base mr-2">{planet.symbol}</span>
                      <span className="text-text-secondary mr-1">{planet.name}</span>
                      <span className="text-text-muted mx-1">→</span>
                      <span>{planet.sign}</span>
                      <span className="text-text-muted ml-1">·</span>
                      <span className="text-text-secondary ml-1">{planet.house}하우스</span>
                    </div>
                  ))}
                  <p className="mt-3 text-xs leading-relaxed text-text-muted">
                    <span className="font-medium text-text-secondary">하우스</span>는 출생 시점의 지평선을 12구역으로 나눈
                    위치로, 행성이 어떤 생활 무대(자아·소통·관계 등)와 연결되는지 보는 관점이에요. 현재 하우스 숫자는
                    앱에서 읽기 쉽게 붙인 <span className="text-text-secondary">참고용</span>이며, 정확한 하우스는 전문
                    출생 차트(에페머리스)가 필요합니다.
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-sm text-text-muted">
                  지금은 태양(기본) + 출생시간이 있을 때 달·상승(근사)만 표시됩니다.
                </p>
              )}
            </GlassCard>

            <GlassCard className="p-5">
              <h4 className="text-sm font-semibold text-text-primary">서양 점성술 Big 3</h4>
              <div className="mt-3 space-y-2 text-sm text-text-secondary">
                <p>
                  <span className="text-accent-gold">태양</span> = 기본 자아와 방향
                </p>
                <p>
                  <span className="text-accent-purple">달</span> = 감정과 속마음
                </p>
                <p>
                  <span className="text-accent-teal">상승</span> = 첫인상과 사회적 이미지
                </p>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </GlassCard>
  );
}

function buildAstroHero(signKo: string): {
  badge: string;
  headline: string;
  supporting: string;
  realLife: string[];
  actionIntro: string;
  actionItems: string[];
  strengthFallback: string;
  cautionFallback: string;
} {
  const s = signKo.trim();
  if (s.includes("염소")) {
    return {
      badge: "현실 설계형",
      headline: "당신은 느리더라도 확실하게 쌓아 올리는 타입이에요",
      supporting: "감정이 흔들릴수록, ‘계획’과 ‘루틴’으로 중심을 다시 잡는 사람이에요.",
      realLife: [
        "처음엔 조용히 관찰하고, 확신이 서면 빠르게 실행해요",
        "감정 표현은 신중하지만, 책임감은 강하게 가져가요",
        "가벼운 약속보다 ‘지속 가능한 관계’를 선호해요",
        "성과가 나올 때까지 버티는 힘이 있어요",
      ],
      actionIntro: "오늘은 속도를 올리기보다, 기준을 분명히 하는 쪽이 유리해요.",
      actionItems: ["오늘 해야 할 ‘핵심 1개’를 먼저 확정하세요", "대화는 결론보다 ‘조건/기준’부터 정리해 보세요", "작은 성과를 남기면 내일이 더 가벼워집니다"],
      strengthFallback: "꾸준함과 책임감이 강점이에요. 장기적으로 이기는 방식에 익숙합니다.",
      cautionFallback: "완벽하게 하려다 시작이 늦어질 수 있어요. 오늘은 80%에서 ‘출발’을 선택해 보세요.",
    };
  }
  if (s.includes("양")) {
    return {
      badge: "직감 실행형",
      headline: "당신은 생각보다 행동이 먼저 나가는 타입이에요",
      supporting: "시작 에너지가 강해 추진력이 장점이지만, 과열되면 소모가 커질 수 있어요.",
      realLife: ["하고 싶다고 느끼면 바로 움직여요", "승부를 빨리 보려는 경향이 있어요", "솔직한 표현이 관계를 단단하게도, 날카롭게도 만들어요"],
      actionIntro: "오늘은 ‘빠르게 시작’보다 ‘지속 가능한 리듬’을 먼저 잡아 주세요.",
      actionItems: ["할 일을 3개만 정하고 추가로 벌리지 않기", "중요한 말은 한 번 더 정리한 뒤 보내기", "10분 휴식을 일정에 먼저 고정하기"],
      strengthFallback: "추진력과 솔직한 에너지가 강점이에요. 분위기를 움직이는 힘이 있습니다.",
      cautionFallback: "속도가 감정을 앞지르면 충돌이 생길 수 있어요. 오늘은 한 템포만 늦춰도 충분히 좋아집니다.",
    };
  }
  // generic fallback
  return {
    badge: "균형 탐색형",
    headline: `당신은 ${s || "별자리"}의 리듬으로 하루를 설계하는 타입이에요`,
    supporting: "오늘의 흐름을 ‘한 문장’으로 잡아두면, 선택이 훨씬 쉬워집니다.",
    realLife: ["감정이 올라오면 판단이 흔들리기 쉬워요", "관계/일의 우선순위가 바뀌는 날엔 피로가 커져요", "결정은 ‘작게’ 시작할수록 성공 확률이 높아져요"],
    actionIntro: "오늘은 ‘큰 결론’보다 ‘작은 실행’으로 흐름을 확인해 보세요.",
    actionItems: ["아침엔 작은 완료 1개 만들기", "중요한 대화는 질문 1개로 시작하기", "하루 중 가장 편한 시간대를 휴식에 배치하기"],
    strengthFallback: "상황을 읽고 흐름을 조정하는 감각이 강점이에요.",
    cautionFallback: "생각이 길어지면 실행이 늦어질 수 있어요. 오늘은 작은 행동으로 시작해 보세요.",
  };
}
