import type { ResultViewModel, AstrologyPeriodKey } from "@/types/result-schema";
import type { UnifiedDomain } from "@/types/unified-domain";

function pickSaju(
  sajuCards: ResultViewModel["saju"]["domainCards"],
  domain: "relationships" | "work" | "money" | "health"
) {
  return sajuCards.find((c) => c.domain === domain);
}

function pickAstro(
  viewModel: ResultViewModel,
  period: AstrologyPeriodKey,
  domain: "love" | "career" | "money" | "health"
) {
  return viewModel.astrology.byPeriod[period]?.domainCards.find((c) => c.domain === domain);
}

/**
 * 4 rows: 연애·관계, 커리어·일, 재물, 건강 — 별자리 점수 + 사주 텍스트 결합.
 * (행운 색·숫자·시간대는 상단 히어로 카드로 이동)
 */
export function buildUnifiedDomains(
  viewModel: ResultViewModel,
  period: AstrologyPeriodKey
): UnifiedDomain[] {
  const saju = viewModel.saju.domainCards;

  const rows: {
    id: string;
    area: string;
    icon: string;
    astroDomain: "love" | "career" | "money" | "health";
    sajuDomain: "relationships" | "work" | "money" | "health";
  }[] = [
    { id: "love-rel", area: "연애·관계", icon: "💕", astroDomain: "love", sajuDomain: "relationships" },
    { id: "career-work", area: "커리어·일", icon: "💼", astroDomain: "career", sajuDomain: "work" },
    { id: "money", area: "재물", icon: "💰", astroDomain: "money", sajuDomain: "money" },
    { id: "health", area: "건강·에너지", icon: "🌿", astroDomain: "health", sajuDomain: "health" },
  ];

  return rows.map((row) => {
    const a = pickAstro(viewModel, period, row.astroDomain);
    const s = pickSaju(saju, row.sajuDomain);
    const score = a?.score ?? 3;
    const astroDetail = a?.summary ?? a?.keyPoint ?? "별자리 기간 흐름을 반영했습니다.";
    const sajuDetail =
      s?.summary?.trim() ||
      viewModel.saju.interpretationFacts.elementBalanceNote ||
      "사주 오행과 일간 성향을 반영했습니다.";
    const parts = [a?.keyPoint, s?.keyPoint].filter(Boolean) as string[];
    let summary =
      parts.join(" · ") ||
      `${row.area} 흐름을 별자리(기간 점수)와 사주 관점에서 함께 정리했습니다.`;
    if (summary.length > 120) summary = `${summary.slice(0, 117)}…`;

    return {
      id: row.id,
      area: row.area,
      icon: row.icon,
      score,
      summary,
      astroDetail,
      sajuDetail,
    };
  });
}
