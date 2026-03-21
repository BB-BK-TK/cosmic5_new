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

/** 숫자 점수 대신 사용자에게 읽기 쉬운 흐름 표현 */
function easeWordStrong(score: number): string {
  if (score >= 5) return "무척 순조로운 편";
  if (score >= 4) return "비교적 순조로운 편";
  return "무난한 편";
}

function cautionForWeakest(label: string, score: number, status: string): string {
  if (score <= 2) {
    return `${label} 쪽은 오늘 다른 영역보다 마음이나 에너지가 더 쓰일 수 있어요. 「${status}」 흐름이 느껴지니, 무리하지 않고 속도를 조금 늦춰 다뤄 보세요. 아래 생활 영역 카드에서도 같은 방향을 참고하면 돼요.`;
  }
  if (score === 3) {
    return `${label}는 오늘 평범한 리듬이에요. 「${status}」를 염두에 두고, 가볍게만 조율하면 충분해요.`;
  }
  return `${label}도 나쁘진 않지만, 다른 영역만큼 여유 있게 가져가면 더 편해요. 「${status}」 쪽만 한 번 더 살보면 좋아요.`;
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
      integratedTheme: `오늘의 기운은 「${energy}」입니다. 연애·일·재물·건강 네 영역이 서로 비슷한 밸런스로, 들쭉날쭉하지 않은 하루로 읽혀요.`,
      cautionSignal: `한쪽만 급하게 밀기보다, 전체 리듬을 지키는 편이 더 편할 거예요.`,
      dailyGuideline: input.heroQuote,
    };
  }

  return {
    integratedTheme: `오늘의 기운은 「${energy}」입니다. 특히 ${strongest.label}이 ${easeWordStrong(strongest.score)}이에요. 「${strongest.status}」 흐름과 잘 맞을 수 있어요.`,
    cautionSignal: cautionForWeakest(weakest.label, weakest.score, weakest.status),
    dailyGuideline: `${input.heroQuote} (${strongest.label}은 자연스럽게 흐름을 타고, ${weakest.label}은 여유 있게 다루면 오늘의 해석과 잘 맞아요.)`,
  };
}
