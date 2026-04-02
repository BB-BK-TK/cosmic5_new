"use client";

import { useMemo, useState } from "react";
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
  /** Phase 3: balance summary and practical advice */
  internalBalanceSummary?: string;
  practicalAdvice?: string;
}

interface SajuCardProps {
  data: SajuData;
}

export function SajuCard({ data }: SajuCardProps) {
  const [learnOpen, setLearnOpen] = useState(false);

  const dayPillar = useMemo(() => data.pillars.find((p) => p.type === "일주"), [data.pillars]);
  const yearPillar = useMemo(() => data.pillars.find((p) => p.type === "년주"), [data.pillars]);
  const monthPillar = useMemo(() => data.pillars.find((p) => p.type === "월주"), [data.pillars]);
  const hourPillar = useMemo(() => data.pillars.find((p) => p.type === "시주"), [data.pillars]);

  const hero = useMemo(() => {
    const ilgan = (data.dayMaster.korean || "").trim();
    if (ilgan === "병") {
      return {
        badge: "몰입 추진형",
        headline: "당신은 강한 추진력과 표현력을 가진 사람이에요",
        supporting:
          "감정과 행동이 빠르게 연결되는 타입이라, 시작은 빠르지만 과열 관리가 중요해요.",
      };
    }
    if (ilgan === "정") {
      return {
        badge: "섬세한 균형형",
        headline: "당신은 감각이 예민하고 흐름을 세밀하게 읽는 사람이에요",
        supporting:
          "작은 변화에 민감한 만큼, 에너지를 한 번에 몰아 쓰지 않고 리듬을 유지하는 게 핵심이에요.",
      };
    }
    return {
      badge: "직감 실행형",
      headline: "당신은 결정을 빠르게 내리고 움직이는 편이에요",
      supporting:
        "상황 판단이 빠른 대신, 속도가 감정을 앞지르지 않도록 ‘한 템포’가 도움이 됩니다.",
    };
  }, [data.dayMaster.korean]);

  const why = useMemo(() => {
    const day = dayPillar?.korean?.trim();
    const hanja = dayPillar?.hanja?.trim();
    if (day === "병인") {
      return {
        lines: [
          "당신의 핵심 기둥인 일주가 ‘병인’이라서,",
          "불의 기운과 호랑이의 추진력이 함께 나타납니다.",
        ],
        chips: ["열정", "표현력", "빠른 반응", "강한 추진력"],
        meta: `일주: ${hanja || "—"} (${day})`,
      };
    }
    return {
      lines: [
        `당신의 핵심 기둥(일주)이 ${day || "—"}로 잡혀,`,
        "타고난 리듬과 결정 방식이 그 방향으로 굳어지기 쉬워요.",
      ],
      chips: ["결정 리듬", "관계 반응", "몰입 방식", "회복 속도"],
      meta: `일주: ${hanja || "—"} (${day || "—"})`,
    };
  }, [dayPillar?.korean, dayPillar?.hanja]);

  const realLife = useMemo(() => {
    // Default sample (병인 중심). If we have non-empty strengths/cautions, blend them.
    const base = [
      "하고 싶다고 느끼면 바로 움직이는 편이에요",
      "감정이 생기면 표현도 빠른 편이에요",
      "집중할 때는 강하게 몰입하지만, 금방 지칠 수 있어요",
      "답답한 상황을 오래 참는 편은 아니에요",
    ];
    const s = (data.strengths ?? []).filter(Boolean).slice(0, 1).map((t) => `강점으로는 “${t}” 흐름이 자주 나타나요.`);
    const c = (data.cautions ?? []).filter(Boolean).slice(0, 1).map((t) => `주의 포인트는 “${t}” 쪽이었어요.`);
    return [...base, ...s, ...c].slice(0, 6);
  }, [data.strengths, data.cautions]);

  const actionGuide = useMemo(() => {
    const intro =
      "오늘은 에너지를 다 쓰기보다, 조절하면서 쓰는 것이 중요해요.";
    const items = [
      "오늘 할 일을 3개만 정해보세요 (추가로 벌리기 금지)",
      "중요한 대화는 한 템포 늦춰서 말해보세요",
      "쉬는 시간을 미리 정해두면 과열을 줄일 수 있어요",
    ];
    const sajuAdvice = (data.practicalAdvice ?? "").trim();
    if (sajuAdvice) {
      items[0] = sajuAdvice.length > 48 ? `${sajuAdvice.slice(0, 47)}…` : sajuAdvice;
    }
    return { intro, items };
  }, [data.practicalAdvice]);

  return (
    <GlassCard badge={{ label: "四柱 Saju", variant: "teal" }}>
      {/* 1) Hero insight */}
      <div className="relative overflow-hidden rounded-2xl border border-glass-border bg-secondary/20 p-5">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 20% 0%, rgba(94, 220, 183, 0.10) 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(155, 138, 255, 0.10) 0%, transparent 50%)",
          }}
        />
        <div className="relative z-10">
          <div className="mb-2 flex justify-center">
            <span className="rounded-full border border-accent-teal/25 bg-accent-teal/[0.08] px-3 py-1 text-xs font-medium text-accent-teal/90">
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

      {/* 2) Why this reading */}
      <div className="mt-4 rounded-2xl border border-glass-border bg-secondary/10 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
          Why this reading appears
        </p>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          {why.lines[0]}
          <br />
          {why.lines[1]}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {why.chips.map((c) => (
            <span
              key={c}
              className="rounded-full border border-glass-border bg-secondary/20 px-3 py-1 text-xs text-text-secondary"
            >
              {c}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-text-muted">{why.meta}</p>
      </div>

      {/* 3) Four pillars (redesigned) */}
      <div className="mt-4">
        <div className="mb-2 flex items-end justify-between gap-2">
          <h3 className="text-sm font-semibold text-text-primary">네 기둥</h3>
          <p className="text-xs text-text-muted">
            핵심: <span className="text-text-secondary">일주</span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <PillarCard
            type="년주"
            meaning="시작 / 배경"
            helper="어떤 환경에서 시작했는지"
            pillar={yearPillar}
          />
          <PillarCard
            type="월주"
            meaning="사회 / 성장"
            helper="사회 속에서 드러나는 나"
            pillar={monthPillar}
          />
          <PillarCard
            type="일주"
            meaning="나의 본질 (핵심)"
            helper="가장 본질적인 나"
            pillar={dayPillar}
            highlight
          />
          <PillarCard
            type="시주"
            meaning="미래 / 가능성"
            helper="앞으로의 방향과 잠재력"
            pillar={hourPillar}
          />
        </div>
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
          <div className="mt-3 space-y-2">
            {(data.strengths?.length ? data.strengths : ["추진력이 좋고 시작 에너지가 강해요."]).slice(0, 4).map((t, i) => (
              <p key={i} className="text-sm leading-relaxed text-text-secondary">
                <span className="mr-2 text-positive">+</span>
                {t}
              </p>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Cautions</p>
          <h3 className="mt-2 text-sm font-semibold text-text-primary">주의 포인트</h3>
          <div className="mt-3 space-y-2">
            {(data.cautions?.length ? data.cautions : ["과열되면 감정 소모가 커져요."]).slice(0, 4).map((t, i) => (
              <p key={i} className="text-sm leading-relaxed text-text-secondary">
                <span className="mr-2 text-caution">!</span>
                {t}
              </p>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* 6) Action guide */}
      <div className="mt-5 rounded-2xl border border-accent-teal/25 bg-accent-teal/[0.06] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-teal/90">
          Action guide
        </p>
        <h3 className="mt-2 text-sm font-semibold text-text-primary">오늘의 실천 조언</h3>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">{actionGuide.intro}</p>
        <div className="mt-3 space-y-2">
          {actionGuide.items.slice(0, 3).map((t, i) => (
            <div key={i} className="rounded-2xl border border-glass-border bg-secondary/10 px-4 py-3">
              <p className="text-sm leading-relaxed text-text-secondary">
                <span className="mr-2 text-accent-teal">→</span>
                {t}
              </p>
            </div>
          ))}
        </div>
        {data.internalBalanceSummary && (
          <p className="mt-3 text-xs leading-relaxed text-text-muted">{data.internalBalanceSummary}</p>
        )}
      </div>

      {/* 7) Learn more (progressive disclosure) */}
      <div className="mt-5">
        <button
          type="button"
          onClick={() => setLearnOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-2xl border border-glass-border bg-secondary/10 px-4 py-4 text-left transition-colors hover:border-glass-highlight"
        >
          <div>
            <p className="text-sm font-semibold text-text-primary">용어·구조 더 알아보기</p>
            <p className="mt-1 text-xs text-text-muted">필요할 때만 열어보세요 (핵심은 위 해석/가이드입니다)</p>
          </div>
          <span className="text-lg text-accent-purple">{learnOpen ? "−" : "+"}</span>
        </button>
        {learnOpen && (
          <div className="mt-3 space-y-3">
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
            <GlassCard className="p-5">
              <h4 className="text-sm font-semibold text-text-primary">사주 四柱 (네 기둥)</h4>
              <div className="mt-3 space-y-2 text-sm text-text-secondary">
                <p>
                  <span className="font-medium text-text-primary">년주</span> = 시작과 배경
                </p>
                <p>
                  <span className="font-medium text-text-primary">월주</span> = 사회성과 성장
                </p>
                <p>
                  <span className="font-medium text-text-primary">일주</span> = 본질적인 나 (핵심)
                </p>
                <p>
                  <span className="font-medium text-text-primary">시주</span> = 미래와 가능성
                </p>
                <p className="pt-2 text-xs text-text-muted">
                  동물(띠) 표시는 지지(十二支)의 상징이에요. 특히 <span className="text-text-secondary">년주</span>의 띠가 흔히 말하는 출생 띠입니다.
                </p>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </GlassCard>
  );
}

function PillarCard(props: {
  type: string;
  meaning: string;
  helper: string;
  pillar?: { type: string; korean: string; hanja: string; animal: string };
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-glass-border bg-secondary/20 p-4",
        props.highlight && "border-accent-teal/35 bg-accent-teal/[0.06] ring-1 ring-accent-teal/25"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-text-primary">{props.type}</p>
          <p className="mt-1 text-xs text-text-muted">{props.meaning}</p>
        </div>
        {props.highlight && (
          <span className="rounded-full border border-accent-teal/25 bg-accent-teal/[0.08] px-2 py-0.5 text-[11px] font-medium text-accent-teal/90">
            핵심
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-lg font-semibold text-accent-teal">{props.pillar?.hanja || "—"}</p>
          <p className="mt-1 text-xs text-text-secondary">{props.pillar?.korean || "—"}</p>
        </div>
        <div className="text-2xl" aria-hidden>
          {props.pillar?.animal ?? "—"}
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-text-muted">{props.helper}</p>
    </div>
  );
}
