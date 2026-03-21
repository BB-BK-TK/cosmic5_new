/**
 * Phase 2 — Layer 1: Calculation.
 * Runs only the raw calculators. No presentation text or UI shaping.
 * Returns normalized raw outputs for the interpretation layer.
 */

import type { AstrologyPeriodKey } from "@/types/result-schema";
import { AstrologyCalculator } from "./astrology-db";
import { SajuCalculator } from "./saju-db";
import { resolveBirthLocation, solarTimeOffsetMinutesByLongitude, getUtcOffsetMinutesAt } from "./birthplace";

export interface AstrologyRawPerPeriod {
  signKo: string;
  period: AstrologyPeriodKey;
  periodLabel: string;
  dateRange: { from: string; to: string };
  energy: string;
  love: { score: number; status: string };
  career: { score: number; status: string };
  money: { score: number; status: string };
  health: { score: number; status: string; bodyPart: string };
  lucky: { color: string; number: number; time: string };
  summary: string;
  signInfo?: { element: string; modality: string; personality: string };
}

export interface SajuRawOutput {
  pillars: { type: string; korean: string; hanja: string; animal: string }[];
  dayMaster: { hanja: string; korean: string; meaning: string };
  elementsPercent: Record<string, number>;
  excess: { element: string; meaning: string } | null;
  deficient: { element: string; meaning: string } | null;
  ilgan: string;
  ilganInfo?: { 상징: string; 장점: string; 단점: string; 성격: string };
  zodiacAnimal: string;
}

export interface CalculationResult {
  birthContext: {
    birthDate: string;
    birthTimeInput: string;
    birthPlaceInput?: string;
    resolvedLocation?: { name: string; lat: number; lon: number; timeZone: string };
    utcOffsetMinutes?: number;
    solarOffsetMinutes?: number;
    adjustedHourForSaju: number;
  };
  astrology: {
    byPeriod: Record<AstrologyPeriodKey, AstrologyRawPerPeriod | null>;
    signKo: string;
    signInfo: { element: string; modality: string; personality: string } | null;
    compatibility: { score: number; summary: string; strengths: string[]; challenges: string[] } | null;
    lifetime: { summary: string; energy: string } | null;
  };
  saju: SajuRawOutput;
}

function dateRangeForPeriod(period: AstrologyPeriodKey, now: Date): { from: string; to: string } {
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  if (period === "daily") return { from: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`, to: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}` };
  if (period === "weekly") {
    const start = new Date(now);
    start.setDate(start.getDate() - start.getDay());
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return { from: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`, to: `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")}` };
  }
  if (period === "monthly") return { from: `${y}-${String(m).padStart(2, "0")}-01`, to: `${y}-${String(m).padStart(2, "0")}-${new Date(y, m, 0).getDate()}` };
  if (period === "yearly") return { from: `${y}-01-01`, to: `${y}-12-31` };
  return { from: "", to: "" };
}

function mapEngineReadingToRaw(
  reading: { signKo: string; overall: { summary: string; energy: string }; love: { status: string; score: number }; career: { status: string; score: number }; money: { status: string; score: number }; health: { status: string; score: number; bodyPart: string }; lucky: { color: string; number: number; time: string } },
  period: AstrologyPeriodKey,
  periodLabel: string,
  now: Date,
  signInfo: { element: string; modality: string; personality: string } | null
): AstrologyRawPerPeriod {
  return {
    signKo: reading.signKo,
    period,
    periodLabel,
    dateRange: dateRangeForPeriod(period, now),
    energy: reading.overall.energy,
    love: { score: reading.love.score, status: reading.love.status },
    career: { score: reading.career.score, status: reading.career.status },
    money: { score: reading.money.score, status: reading.money.status },
    health: { score: reading.health.score, status: reading.health.status, bodyPart: reading.health.bodyPart },
    lucky: { ...reading.lucky },
    summary: reading.overall.summary,
    signInfo: signInfo ?? undefined,
  };
}

/**
 * Run all calculations. No UI or interpretation — raw only.
 */
export function runCalculations(
  birthDate: string,
  birthTime: string,
  birthPlace: string | undefined,
  astrologyCalc: AstrologyCalculator,
  sajuCalc: SajuCalculator
): CalculationResult {
  const [yStr, mStr, dStr] = birthDate.split("-");
  const year = Number(yStr);
  const month = Number(mStr);
  const day = Number(dStr);
  const birthDateObj = new Date(year, month - 1, day);
  const now = new Date();
  const [hourStr, minuteStr] = (birthTime || "12:00").split(":");
  let hourNum = Number(hourStr);
  let minuteNum = Number(minuteStr ?? "0");
  if (!Number.isFinite(hourNum)) hourNum = 12;
  if (!Number.isFinite(minuteNum)) minuteNum = 0;

  const place = resolveBirthLocation(birthPlace);
  let utcOffsetMinutes: number | undefined;
  let solarOffsetMinutes: number | undefined;
  if (place) {
    const atDate = new Date(year, month - 1, day, hourNum, minuteNum, 0);
    utcOffsetMinutes = getUtcOffsetMinutesAt(atDate, place.timeZone);
    solarOffsetMinutes = solarTimeOffsetMinutesByLongitude(place.lon, utcOffsetMinutes);
    const total = hourNum * 60 + minuteNum + solarOffsetMinutes;
    const normalized = ((total % 1440) + 1440) % 1440;
    hourNum = Math.floor(normalized / 60);
  }

  const sign = astrologyCalc.getSign(month, day);
  const db = (astrologyCalc as { db?: { signs?: { data?: Record<string, { element?: string; modality?: string; personality?: string }> } } }).db;
  const signInfo = db?.signs?.data?.[sign] ? { element: db.signs.data[sign].element ?? "", modality: db.signs.data[sign].modality ?? "", personality: db.signs.data[sign].personality ?? "" } : null;

  const daily = astrologyCalc.getDaily(sign, now);
  const lifetime = astrologyCalc.getLifetime(birthDateObj);

  /** UI: 오늘의 운세만. 주·월·년 raw는 계산하지 않음 (타입 호환을 위해 null). */
  const byPeriod: Record<AstrologyPeriodKey, AstrologyRawPerPeriod | null> = {
    daily: mapEngineReadingToRaw(daily, "daily", "오늘", now, signInfo),
    weekly: null,
    monthly: null,
    yearly: null,
    lifetime: null,
  };
  if (lifetime) {
    byPeriod.lifetime = {
      signKo: sign,
      period: "lifetime",
      periodLabel: "인생",
      dateRange: { from: "", to: "" },
      energy: lifetime.energy,
      love: { score: 3, status: "—" },
      career: { score: 3, status: "—" },
      money: { score: 3, status: "—" },
      health: { score: 3, status: "—", bodyPart: "—" },
      lucky: { color: "—", number: 0, time: "—" },
      summary: lifetime.summary,
      signInfo: signInfo ?? undefined,
    };
  }

  const saju = sajuCalc.calculate(year, month, day, hourNum);
  const pillarsDisplay = sajuCalc.getPillarDisplay(saju);
  const dayMasterDisplay = sajuCalc.getDayMasterDisplay(saju);
  const analysis = sajuCalc.getElementsAnalysis(saju.elements?.퍼센트);
  const percent = (saju.elements?.퍼센트 || {}) as Record<string, number>;

  const zodiacEmoji: Record<string, string> = { 쥐: "🐀", 소: "🐂", 호랑이: "🐅", 토끼: "🐇", 용: "🐉", 뱀: "🐍", 말: "🐎", 양: "🐐", 원숭이: "🐒", 닭: "🐓", 개: "🐕", 돼지: "🐖" };
  const pillars = pillarsDisplay.map((p, i) => ({ ...p, animal: i === 0 ? (zodiacEmoji[saju.띠] || p.animal) : p.animal }));

  return {
    birthContext: {
      birthDate,
      birthTimeInput: birthTime || "12:00",
      birthPlaceInput: birthPlace,
      resolvedLocation: place ? { name: place.name, lat: place.lat, lon: place.lon, timeZone: place.timeZone } : undefined,
      utcOffsetMinutes,
      solarOffsetMinutes,
      adjustedHourForSaju: hourNum,
    },
    astrology: {
      byPeriod,
      signKo: sign,
      signInfo,
      compatibility: null,
      lifetime: lifetime ? { summary: lifetime.summary, energy: lifetime.energy } : null,
    },
    saju: {
      pillars,
      dayMaster: dayMasterDisplay,
      elementsPercent: percent,
      excess: analysis.excess,
      deficient: analysis.deficient,
      ilgan: saju.일간,
      ilganInfo: saju.일간정보 as any,
      zodiacAnimal: saju.띠,
    },
  };
}
