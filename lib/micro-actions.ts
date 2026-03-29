/**
 * 오늘의 실천 3줄 — 별자리 도메인 점수, 사주 실천 조언, 건강/에너지 힌트에서 규칙 기반 생성.
 */

import type { AstrologyPeriodKey } from "@/types/result-schema";
import type { AstrologyRichInterpretation } from "@/lib/interpretation/astrology-interpreter";
import type { SajuRichInterpretation } from "@/lib/interpretation/saju-interpreter";

type InterpretationBundle = {
  astrology: Record<AstrologyPeriodKey, AstrologyRichInterpretation | null>;
  saju: SajuRichInterpretation;
};

function clampSentence(s: string, max: number): string {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

type DomainKey = "love" | "career" | "money" | "health";

const WEAKEST_HINTS: Record<DomainKey, string> = {
  love: "오늘은 관계 말 한마디(짧은 메시지나 인사)만이라도 부드럽게 주고받아 보세요.",
  career: "일은 한 번에 한 가지씩 끊어서 처리하고, 중간에 5분만 숨 고르기를 넣어 보세요.",
  money: "지출 한 줄만 메모하고, 당장 필요 없는 소비는 내일로 미뤄 보세요.",
  health: "몸의 긴장을 풀 시간 10분(스트레칭·산책)을 먼저 확보해 보세요.",
};

export function buildMicroActionsFromReading(
  interpretation: InterpretationBundle,
  period: AstrologyPeriodKey
): { id: string; text: string; tag: string }[] {
  const astro = interpretation.astrology[period];
  const facts = astro?.interpretationFacts;
  const saju = interpretation.saju.interpretationFacts;

  const out: { id: string; text: string; tag: string }[] = [];

  if (
    facts &&
    [facts.loveScore, facts.careerScore, facts.moneyScore, facts.healthScore].every(
      (n) => typeof n === "number" && n >= 1 && n <= 5
    )
  ) {
    const rows: { key: DomainKey; score: number }[] = [
      { key: "love", score: facts.loveScore },
      { key: "career", score: facts.careerScore },
      { key: "money", score: facts.moneyScore },
      { key: "health", score: facts.healthScore },
    ];
    let wi = 0;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i].score < rows[wi].score) wi = i;
    }
    const weakest = rows[wi];
    out.push({
      id: `micro-${weakest.key}`,
      text: WEAKEST_HINTS[weakest.key],
      tag:
        weakest.key === "love"
          ? "연애·관계"
          : weakest.key === "career"
            ? "커리어"
            : weakest.key === "money"
              ? "재물"
              : "건강",
    });
  } else {
    out.push({
      id: "micro-balance",
      text: "오늘의 전반적인 흐름에 맞춰, 무리하지 않는 속도로 하루를 짜 보세요.",
      tag: "균형",
    });
  }

  if (saju?.practicalAdvice?.trim()) {
    out.push({
      id: "micro-saju",
      text: clampSentence(saju.practicalAdvice, 96),
      tag: "사주",
    });
  }

  const body = facts?.bodyPart?.trim();
  if (body && body !== "—") {
    out.push({
      id: "micro-body",
      text: `${body} 쪽은 무리한 자세·과로를 피하고 가볍게 돌봐 주세요.`,
      tag: "건강",
    });
  } else if (facts?.energy?.trim()) {
    out.push({
      id: "micro-energy",
      text: `오늘의 기운「${facts.energy}」에 맞게, 그 에너지를 한 가지 활동에만 써 보세요.`,
      tag: "에너지",
    });
  }

  const uniq: { id: string; text: string; tag: string }[] = [];
  const seen = new Set<string>();
  for (const a of out) {
    const k = a.text.slice(0, 40);
    if (seen.has(k)) continue;
    seen.add(k);
    uniq.push(a);
    if (uniq.length >= 3) break;
  }

  while (uniq.length < 3) {
    uniq.push({
      id: `micro-fill-${uniq.length}`,
      text: "하루 끝에 오늘 잘한 일 한 가지만 짧게 적어 보세요.",
      tag: "회고",
    });
  }

  return uniq.slice(0, 3);
}
