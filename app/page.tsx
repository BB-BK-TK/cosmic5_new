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

type FortuneData = {
  keyMessage: string;
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
  integrated: { commonTheme: string; cautionSignal: string; dailyGuideline: string };
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
      const daily = astrologyCalculator.getDaily(sign, new Date());
      // --- Local saju calculation ---
      const [hourStr = "12"] = (birthInfo.birthTime || "12:00").split(":");
      const hourNum = Number(hourStr);

      const saju = sajuCalculator.calculate(year, month, day, hourNum);

      const pillars = [
        {
          type: "년주",
          korean: "",
          hanja: saju.year.ganji,
          animal: zodiacEmoji(saju.띠),
        },
        {
          type: "월주",
          korean: "",
          hanja: saju.month.ganji,
          animal: "",
        },
        {
          type: "일주",
          korean: "",
          hanja: saju.day.ganji,
          animal: "",
        },
        {
          type: "시주",
          korean: "",
          hanja: saju.hour.ganji,
          animal: "",
        },
      ];

      const elementsPercent = saju.elements.퍼센트 as any;
      const fiveScaled = {
        wood: elementsPercent["목"] ?? 0,
        fire: elementsPercent["화"] ?? 0,
        earth: elementsPercent["토"] ?? 0,
        metal: elementsPercent["금"] ?? 0,
        water: elementsPercent["수"] ?? 0,
      };

      const strengths = [
        `당신의 일간은 ${saju.일간}으로, ${saju.일간정보.상징} 타입의 기운을 가지고 있어요.`,
        `장점: ${saju.일간정보.장점}`,
      ];
      const cautions = [`주의 포인트: ${saju.일간정보.단점}`];

      const keyMessage = daily.overall.summary;
      const fortune: FortuneData = {
        keyMessage,
        astrology: {
          sunSign: daily.signKo,
          moonSign: "—",
          risingSign: "—",
          planets: [],
          insights: [
            daily.overall.energy,
            `연애: ${daily.love.status} (${daily.love.score}/5)`,
            `커리어: ${daily.career.status} (${daily.career.score}/5)`,
            `재물: ${daily.money.status} (${daily.money.score}/5)`,
            `건강: ${daily.health.status} (${daily.health.score}/5, ${daily.health.bodyPart})`,
            `행운 색: ${daily.lucky.color}, 숫자: ${daily.lucky.number}, 시간대: ${daily.lucky.time}`,
          ],
        },
        saju: {
          pillars,
          dayMaster: {
            hanja: saju.일간,
            korean: "",
            meaning: saju.일간정보.성격,
          },
          strengths,
          cautions,
        },
        fiveElements: {
          ...fiveScaled,
          analysis: {
            excess: null,
            deficient: null,
          },
        },
        integrated: {
          commonTheme: `오늘의 키워드: ${daily.overall.energy}`,
          cautionSignal: `관계: ${daily.love.status}`,
          dailyGuideline: keyMessage,
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

            {/* Key Message */}
            <KeyMessageCard
              message={fortuneData.keyMessage}
              date={formatDate()}
            />

            {/* Astrology Card */}
            <AstrologyCard data={fortuneData.astrology} />

            {/* Saju Card */}
            <SajuCard data={fortuneData.saju} />

            {/* Five Elements Chart */}
            <FiveElementsChart data={fortuneData.fiveElements} />

            {/* Integrated Insight */}
            <IntegratedInsightCard data={fortuneData.integrated} />

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
