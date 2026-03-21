/**
 * 통합 탭 styleReadyText를 별자리 도메인 점수·상태와 정합되게 만든다.
 * 생활 영역 통합(ScoreStars)과 같은 love/career/money/health score를 사용한다.
 */

import type { AstrologyInterpretationFacts } from "@/types/result-schema";

type DomainSlice = { key: string; label: string; score: number; status: string };

const DOMAIN_ORDER: { key: keyof Pick<AstrologyInterpretationFacts, "loveScore" | "careerScore" | "moneyScore" | "healthScore">; label: string; statusKey: keyof Pick<AstrologyInterpretationFacts, "loveStatus" | "careerStatus" | "moneyStatus" | "healthStatus"> }[] = [
  { key: "loveScore", label: "연애·관계", statusKey: "loveStatus" },
  { key: "careerScore", label: "커리어·일", statusKey: "careerStatus" },
  { key: "moneyScore", label: "재물", statusKey: "moneyStatus" },
  { key: "healthScore", label: "건강·에너지", statusKey: "healthStatus" },
];

function isCompleteFacts(f: AstrologyInterpretationFacts | null | undefined): f is AstrologyInterpretationFacts {
  if (!f) return false;
  return [f.loveScore, f.careerScore, f.moneyScore, f.healthScore].every((n) => typeof n === "number" && n >= 1 && n <= 5);
}

function toRows(f: AstrologyInterpretationFacts): DomainSlice[] {
  return DOMAIN_ORDER.map(({ key, label, statusKey }) => ({
    key,
    label,
    score: f[key] as number,
    status: String(f[statusKey] ?? "").trim() || "흐름을 살펴보세요.",
  }));
}

/** 동점이면 DOMAIN_ORDER 앞쪽 우선 */
function indexOfMin(rows: DomainSlice[]): number {
  let idx = 0;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].score < rows[idx].score) idx = i;
  }
  return idx;
}

function indexOfMax(rows: DomainSlice[]): number {
  let idx = 0;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].score > rows[idx].score) idx = i;
  }
  return idx;
}

export function deriveCorrelatedStyleText(input: {
  facts: AstrologyInterpretationFacts | null | undefined;
  energyLabel: string;
  heroQuote: string;
  /** facts 불완전 시 폴백 */
  loveStatusFallback: string;
}): { integratedTheme: string; cautionSignal: string; dailyGuideline: string } {
  const energy = (input.energyLabel || "균형").trim() || "균형";

  if (!isCompleteFacts(input.facts)) {
    return {
      integratedTheme: `오늘의 키워드: ${energy}`,
      cautionSignal: `관계·소통: ${input.loveStatusFallback || "무리하지 않는 페이스를 권해요."}`,
      dailyGuideline: input.heroQuote,
    };
  }

  const rows = toRows(input.facts);
  const iMin = indexOfMin(rows);
  const iMax = indexOfMax(rows);
  const weakest = rows[iMin];
  const strongest = rows[iMax];

  if (weakest.score === strongest.score) {
    return {
      integratedTheme: `오늘의 기운은 「${energy}」입니다. 연애·일·재물·건강 네 영역이 모두 ${weakest.score}/5 근처로, 큰 편차 없이 고른 흐름으로 읽힙니다.`,
      cautionSignal: `특정 한 영역만 급하게 밀기보다, 전체 리듬을 지키는 하루가 좋아요.`,
      dailyGuideline: input.heroQuote,
    };
  }

  return {
    integratedTheme: `오늘의 기운은 「${energy}」입니다. 생활 영역 중 ${strongest.label}(${strongest.score}/5)이 상대적으로 순조롭고, 「${strongest.status}」 흐름과 맞닿아 있어요.`,
    cautionSignal: `${weakest.label}는 ${weakest.score}/5 구간으로, 생활 영역 통합 카드의 별점과 같은 기준입니다. 「${weakest.status}」 쪽 기운이 있으니 이 영역은 속도를 조금 늦추고 살피면 좋아요.`,
    dailyGuideline: `${input.heroQuote} (${strongest.label}은 흐름을 타고, ${weakest.label}은 여유 있게 다루면 통합 해석과 맞물립니다.)`,
  };
}
