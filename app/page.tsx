"use client";

import { useState } from "react";
import { StarBackground } from "@/components/star-background";
import { BirthInfoForm, type BirthInfo } from "@/components/birth-info-form";
import { KeyMessageCard } from "@/components/key-message-card";
import { AstrologyCard } from "@/components/astrology-card";
import { SajuCard } from "@/components/saju-card";
import { FiveElementsChart } from "@/components/five-elements-chart";
import { IntegratedInsightCard } from "@/components/integrated-insight-card";
import { MicroActionCard } from "@/components/micro-action-card";
import { ResultTabs } from "@/components/result-tabs";
import { LoadingScreen } from "@/components/loading-screen";
import { cn } from "@/lib/utils";
import { SajuCalculator } from "@/lib/saju-db";
import { AstrologyCalculator } from "@/lib/astrology-db";

type PeriodReading = {
  signKo: string;
  overall: { summary: string; energy: string };
  love: { status: string; score: number };
  career: { status: string; score: number };
  money: { status: string; score: number };
  health: { status: string; score: number; bodyPart: string };
  lucky: { color: string; number: number; time: string };
};

type FortuneData = {
  readings: { daily: PeriodReading; weekly: PeriodReading; monthly: PeriodReading; yearly: PeriodReading };
  astrology: {
    sunSign: string;
    moonSign: string;
    risingSign: string;
    planets: { name: string; symbol: string; sign: string; house: number }[];
    insights: string[];
  };
  saju: {
    pillars: { type: string; korean: string; hanja: string; animal: string }[];
    dayMaster: { hanja: string; korean: string; meaning: string };
    strengths: string[];
    cautions: string[];
  };
  fiveElements: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
    analysis: {
      excess: { element: string; meaning: string } | null;
      deficient: { element: string; meaning: string } | null;
    };
  };
  integrated: { commonTheme: string; cautionSignal: string; dailyGuideline: string; lifetimeTheme?: string };
  microActions: { id: string; text: string; tag: string }[];
};

function zodiacEmoji(animalKo: string) {
  switch (animalKo) {
    case "쥐":
      return "🐀";
    case "소":
      return "🐂";
    case "호랑이":
      return "🐅";
    case "토끼":
      return "🐇";
    case "용":
      return "🐉";
    case "뱀":
      return "🐍";
    case "말":
      return "🐎";
    case "양":
      return "🐐";
    case "원숭이":
      return "🐒";
    case "닭":
      return "🐓";
    case "개":
      return "🐕";
    case "돼지":
      return "🐖";
    default:
      return "✦";
  }
}

export default function CosmicFivePage() {
  const [view, setView] = useState<"input" | "loading" | "result">("input");
  const [activeTab, setActiveTab] = useState("today");
  const [fortuneData, setFortuneData] = useState<FortuneData | null>(null);
  const [lastBirthInfo, setLastBirthInfo] = useState<BirthInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isSubmitting = view === "loading";
  const sajuCalculator = new SajuCalculator();
  const astrologyCalculator = new AstrologyCalculator();

  const handleSubmit = async (birthInfo: BirthInfo) => {
    setLastBirthInfo(birthInfo);
    setView("loading");
    setErrorMessage(null);

    try {
      const [yStr, mStr, dStr] = birthInfo.birthDate.split("-");
      const year = Number(yStr);
      const month = Number(mStr);
      const day = Number(dStr);
      const birthDateObj = new Date(year, month - 1, day);

      const sign = astrologyCalculator.getSign(month, day);
      const now = new Date();
      const daily = astrologyCalculator.getDaily(sign, now);
      const weekly = astrologyCalculator.getWeekly(sign, now);
      const monthly = astrologyCalculator.getMonthly(sign, now.getFullYear(), now.getMonth() + 1);
      const yearly = astrologyCalculator.getYearly(sign, now.getFullYear());
      // --- Local saju calculation ---
      const [hourStr = "12"] = (birthInfo.birthTime || "12:00").split(":");
      const hourNum = Number(hourStr);

      const saju = sajuCalculator.calculate(year, month, day, hourNum);

      // Phase 1: Use getPillarDisplay for full korean/animal; year pillar shows zodiac emoji.
      const pillarsRaw = sajuCalculator.getPillarDisplay(saju);
      const pillars = pillarsRaw.map((p, i) => ({
        ...p,
        animal: i === 0 ? zodiacEmoji(saju.띠) : p.animal,
      }));

      const elementsPercent = (saju.elements?.퍼센트 || {}) as Record<string, number>;
      const fiveScaled = {
        wood: elementsPercent["목"] ?? 0,
        fire: elementsPercent["화"] ?? 0,
        earth: elementsPercent["토"] ?? 0,
        metal: elementsPercent["금"] ?? 0,
        water: elementsPercent["수"] ?? 0,
      };

      // Phase 1: Five-elements analysis from saju (excess/deficient).
      const analysis = sajuCalculator.getElementsAnalysis(saju.elements?.퍼센트);

      const strengths = [
        `당신의 일간은 ${saju.일간}으로, ${saju.일간정보?.상징 || "독특한"} 타입의 기운을 가지고 있어요.`,
        `장점: ${saju.일간정보?.장점 || "다양한 강점"}`,
      ];
      const cautions = [`주의 포인트: ${saju.일간정보?.단점 || "무리하지 않기"}`];

      // Phase 1: Lifetime reading (real v1 from astrology engine).
      const lifetime = astrologyCalculator.getLifetime(birthDateObj);

      function insightsFromReading(r: PeriodReading) {
        return [
          r.overall.energy,
          `연애: ${r.love.status} (${r.love.score}/5)`,
          `커리어: ${r.career.status} (${r.career.score}/5)`,
          `재물: ${r.money.status} (${r.money.score}/5)`,
          `건강: ${r.health.status} (${r.health.score}/5, ${r.health.bodyPart})`,
          `행운 색: ${r.lucky.color}, 숫자: ${r.lucky.number}, 시간대: ${r.lucky.time}`,
        ];
      }

      // Phase 1: Sun-only planet row so "핵심 행성" is not empty; Moon/Rising show clear label.
      const planets = [
        { name: "태양", symbol: "☉", sign: daily.signKo, house: 1 },
      ];

      const fortune: FortuneData = {
        readings: { daily, weekly, monthly, yearly },
        astrology: {
          sunSign: daily.signKo,
          moonSign: "출생시간 필요",
          risingSign: "출생시간 필요",
          planets,
          insights: insightsFromReading(daily),
        },
        saju: {
          pillars,
          dayMaster: sajuCalculator.getDayMasterDisplay(saju),
          strengths,
          cautions,
        },
        fiveElements: {
          ...fiveScaled,
          analysis,
        },
        integrated: {
          commonTheme: `오늘의 키워드: ${daily.overall.energy}`,
          cautionSignal: `관계: ${daily.love.status}`,
          dailyGuideline: daily.overall.summary,
          lifetimeTheme: lifetime.summary,
        },
        microActions: [
          { id: "1", text: "오늘의 핵심 목표 1개만 정하고 끝내기", tag: "커리어" },
          { id: "2", text: "짧게 산책하며 리듬 회복하기", tag: "건강" },
          { id: "3", text: "감정이 올라오면 10초 멈추고 한 번 더 생각하기", tag: "멘탈" },
        ],
      };

      setFortuneData(fortune);
      setView("result");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setErrorMessage(msg);
      setView("input");
    }
  };

  const handleBack = () => {
    setView("input");
  };

  const handleRegenerate = () => {
    if (lastBirthInfo) {
      void handleSubmit(lastBirthInfo);
    }
  };

  const formatDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "long",
    };
    return today.toLocaleDateString("ko-KR", options);
  };

  const formatDateByTab = (tab: string) => {
    const now = new Date();
    if (tab === "today") return formatDate();
    if (tab === "week") {
      const start = new Date(now);
      start.setDate(start.getDate() - start.getDay());
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return `${start.getFullYear()}년 ${start.getMonth() + 1}월 ${start.getDate()}일–${end.getDate()}일`;
    }
    if (tab === "month") {
      return `${now.getFullYear()}년 ${now.getMonth() + 1}월`;
    }
    if (tab === "year") return `${now.getFullYear()}년`;
    return formatDate();
  };

  const getReadingByTab = (tab: string): PeriodReading | null => {
    if (!fortuneData?.readings) return null;
    const key = tab === "today" ? "daily" : tab === "week" ? "weekly" : tab === "month" ? "monthly" : "yearly";
    return fortuneData.readings[key] ?? null;
  };

  const currentReading =
    view === "result" && fortuneData ? getReadingByTab(activeTab) ?? fortuneData.readings.daily : null;
  const periodInsights = currentReading
    ? [
        currentReading.overall.energy,
        `연애: ${currentReading.love.status} (${currentReading.love.score}/5)`,
        `커리어: ${currentReading.career.status} (${currentReading.career.score}/5)`,
        `재물: ${currentReading.money.status} (${currentReading.money.score}/5)`,
        `건강: ${currentReading.health.status} (${currentReading.health.score}/5, ${currentReading.health.bodyPart})`,
        `행운 색: ${currentReading.lucky.color}, 숫자: ${currentReading.lucky.number}, 시간대: ${currentReading.lucky.time}`,
      ]
    : [];
  const periodIntegrated = currentReading
    ? {
        commonTheme: `키워드: ${currentReading.overall.energy}`,
        cautionSignal: `관계: ${currentReading.love.status}`,
        dailyGuideline: currentReading.overall.summary,
      }
    : { commonTheme: "", cautionSignal: "", dailyGuideline: "" };

  return (
    <div className="min-h-screen bg-background relative">
      <StarBackground />

      <div className="relative z-10 max-w-[480px] mx-auto px-5 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          {view === "result" && (
            <button
              onClick={handleBack}
              className="absolute left-5 top-8 text-text-muted hover:text-text-secondary transition-colors"
            >
              ← 뒤로
            </button>
          )}
          <h1
            className="text-3xl font-light tracking-tight text-text-primary mb-2"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            Cosmic 五
          </h1>
          <p className="text-sm text-text-secondary">
            별과 오행이 읽어주는 오늘의 방향
          </p>
        </header>

        {/* Content */}
        {view === "input" && (
          <div className="space-y-4">
            {errorMessage && (
              <div
                className={cn(
                  "px-4 py-3 rounded-xl text-sm",
                  "bg-caution/10 border border-caution/20 text-text-secondary"
                )}
              >
                {errorMessage}
              </div>
            )}
            <BirthInfoForm onSubmit={handleSubmit} isLoading={isSubmitting} />
          </div>
        )}

        {view === "loading" && <LoadingScreen />}

        {view === "result" && fortuneData && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Tabs */}
            <ResultTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Key Message — Phase 1: safe fallback so we never pass null. */}
            <KeyMessageCard
              message={(currentReading ?? fortuneData.readings.daily).overall.summary}
              date={formatDateByTab(activeTab)}
            />

            {/* Astrology Card */}
            <AstrologyCard data={{ ...fortuneData.astrology, insights: periodInsights }} />

            {/* Saju Card */}
            <SajuCard data={fortuneData.saju} />

            {/* Five Elements Chart */}
            <FiveElementsChart data={fortuneData.fiveElements} />

            {/* Integrated Insight — Phase 1: include lifetime theme when present. */}
            <IntegratedInsightCard data={{ ...periodIntegrated, lifetimeTheme: fortuneData.integrated.lifetimeTheme }} />

            {/* Micro Actions */}
            <MicroActionCard actions={fortuneData.microActions} />

            {/* Regenerate Button */}
            <button
              onClick={handleRegenerate}
              className={cn(
                "w-full h-[52px] rounded-xl font-medium text-sm",
                "bg-transparent border border-glass-border",
                "text-text-secondary",
                "transition-all duration-200",
                "hover:bg-glass-bg flex items-center justify-center gap-2"
              )}
            >
              <span>↻</span> 다른 해석 보기
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-xs text-text-muted">
            ✦ Cosmic 五 · 별과 오행의 조화
          </p>
        </footer>
      </div>
    </div>
  );
}
