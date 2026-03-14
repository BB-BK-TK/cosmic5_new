/**
 * Phase 2 — Layer 2: Interpretation.
 * Consumes raw calculation output. Produces interpretationFacts, interpretedSummary, domainCards.
 * No presentation copy hardcoded here; we build structured data for the presentation layer.
 */

import type { AstrologyPeriodKey, AstrologyDomainCard, AstrologyInterpretationFacts, SajuDomainCard, SajuInterpretationFacts } from "@/types/result-schema";
import type { CalculationResult, AstrologyRawPerPeriod, SajuRawOutput } from "./calculation-layer";

export interface AstrologyInterpreted {
  period: AstrologyPeriodKey;
  interpretationFacts: AstrologyInterpretationFacts;
  interpretedSummary: string;
  domainCards: AstrologyDomainCard[];
}

export interface SajuInterpreted {
  interpretationFacts: SajuInterpretationFacts;
  interpretedSummary: string;
  domainCards: SajuDomainCard[];
}

function interpretAstrologyPeriod(raw: AstrologyRawPerPeriod): AstrologyInterpreted {
  const facts: AstrologyInterpretationFacts = {
    energy: raw.energy,
    loveScore: raw.love.score,
    careerScore: raw.career.score,
    moneyScore: raw.money.score,
    healthScore: raw.health.score,
    loveStatus: raw.love.status,
    careerStatus: raw.career.status,
    moneyStatus: raw.money.status,
    healthStatus: raw.health.status,
    bodyPart: raw.health.bodyPart,
    luckyColor: raw.lucky.color,
    luckyNumber: raw.lucky.number,
    luckyTime: raw.lucky.time,
  };
  const summary = raw.summary;
  const domainCards: AstrologyDomainCard[] = [
    { id: "love", domain: "love", title: "연애", score: raw.love.score, summary: raw.love.status, keyPoint: undefined },
    { id: "career", domain: "career", title: "커리어", score: raw.career.score, summary: raw.career.status, keyPoint: undefined },
    { id: "money", domain: "money", title: "재물", score: raw.money.score, summary: raw.money.status, keyPoint: undefined },
    { id: "health", domain: "health", title: "건강", score: raw.health.score, summary: `${raw.health.status} (${raw.health.bodyPart})`, keyPoint: raw.health.bodyPart },
  ];
  return {
    period: raw.period,
    interpretationFacts: facts,
    interpretedSummary: summary,
    domainCards,
  };
}

function interpretSaju(raw: SajuRawOutput): SajuInterpreted {
  const ilgan = raw.ilganInfo;
  const dominant = raw.excess?.element ?? null;
  const weak = raw.deficient?.element ?? null;
  const interpretationFacts: SajuInterpretationFacts = {
    dayMasterPersonality: raw.dayMaster.meaning || "",
    dayMasterStrengths: ilgan?.장점 ?? "다양한 강점",
    dayMasterCautions: ilgan?.단점 ?? "무리하지 않기",
    dominantElement: dominant,
    weakElement: weak,
    elementBalanceNote: !dominant && !weak ? "오행이 고르게 분포되어 있어요." : [raw.excess?.meaning, raw.deficient?.meaning].filter(Boolean).join(" ") || "",
  };
  const interpretedSummary = `일간 ${raw.ilgan}(${raw.dayMaster.hanja}), ${ilgan?.상징 ?? "독특한"} 타입. ${interpretationFacts.dayMasterPersonality}`;
  const domainCards: SajuDomainCard[] = [
    { id: "character", domain: "character", title: "일간 성향", summary: interpretationFacts.dayMasterPersonality, keyPoint: raw.ilgan },
    { id: "strengths", domain: "strengths", title: "강점", summary: interpretationFacts.dayMasterStrengths },
    { id: "cautions", domain: "cautions", title: "주의", summary: interpretationFacts.dayMasterCautions },
    { id: "advice", domain: "advice", title: "조언", summary: interpretationFacts.elementBalanceNote || "균형을 유지하세요." },
  ];
  return {
    interpretationFacts,
    interpretedSummary,
    domainCards,
  };
}

/**
 * Build interpretation from raw calculation result.
 */
export function runInterpretation(calculation: CalculationResult): {
  astrology: Record<AstrologyPeriodKey, AstrologyInterpreted | null>;
  saju: SajuInterpreted;
} {
  const astrology: Record<AstrologyPeriodKey, AstrologyInterpreted | null> = {
    daily: calculation.astrology.byPeriod.daily ? interpretAstrologyPeriod(calculation.astrology.byPeriod.daily) : null,
    weekly: calculation.astrology.byPeriod.weekly ? interpretAstrologyPeriod(calculation.astrology.byPeriod.weekly) : null,
    monthly: calculation.astrology.byPeriod.monthly ? interpretAstrologyPeriod(calculation.astrology.byPeriod.monthly) : null,
    yearly: calculation.astrology.byPeriod.yearly ? interpretAstrologyPeriod(calculation.astrology.byPeriod.yearly) : null,
    lifetime: calculation.astrology.byPeriod.lifetime ? interpretAstrologyPeriod(calculation.astrology.byPeriod.lifetime) : null,
  };
  const saju = interpretSaju(calculation.saju);
  return { astrology, saju };
}
