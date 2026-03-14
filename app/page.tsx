"use client";

import { useState, useMemo } from "react";
import { StarBackground } from "@/components/star-background";
import { BirthInfoForm, type BirthInfo } from "@/components/birth-info-form";
import { ResultTabs } from "@/components/result-tabs";
import { LoadingScreen } from "@/components/loading-screen";
import { HeroSummary, DomainCards, WhyThisResult, MetadataTags } from "@/components/result";
import { AstrologyCard } from "@/components/astrology-card";
import { SajuCard } from "@/components/saju-card";
import { FiveElementsChart } from "@/components/five-elements-chart";
import { IntegratedInsightCard } from "@/components/integrated-insight-card";
import { MicroActionCard } from "@/components/micro-action-card";
import { cn } from "@/lib/utils";
import { SajuCalculator } from "@/lib/saju-db";
import { AstrologyCalculator } from "@/lib/astrology-db";
import { runCalculations } from "@/lib/calculation-layer";
import { runInterpretation } from "@/lib/interpretation-layer";
import { buildResultViewModel, getViewModelSliceForPeriod } from "@/lib/presentation-layer";
import type { ResultViewModel } from "@/types/result-schema";
import type { AstrologyPeriodKey } from "@/types/result-schema";

const TAB_TO_PERIOD: Record<string, AstrologyPeriodKey> = {
  today: "daily",
  week: "weekly",
  month: "monthly",
  year: "yearly",
};

export default function CosmicFivePage() {
  const [view, setView] = useState<"input" | "loading" | "result">("input");
  const [activeTab, setActiveTab] = useState("today");
  const [resultViewModel, setResultViewModel] = useState<ResultViewModel | null>(null);
  const [lastBirthInfo, setLastBirthInfo] = useState<BirthInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isSubmitting = view === "loading";
  const astrologyCalculator = new AstrologyCalculator();
  const sajuCalculator = new SajuCalculator();

  const handleSubmit = async (birthInfo: BirthInfo) => {
    setLastBirthInfo(birthInfo);
    setView("loading");
    setErrorMessage(null);
    try {
      // Layer 1: Calculation only
      const calculation = runCalculations(
        birthInfo.birthDate,
        birthInfo.birthTime || "12:00",
        astrologyCalculator,
        sajuCalculator
      );
      // Layer 2: Interpretation
      const interpretation = runInterpretation(calculation);
      // Layer 3: Presentation / view-model
      const viewModel = buildResultViewModel(calculation, interpretation, {
        birthDate: birthInfo.birthDate,
        birthTime: birthInfo.birthTime,
        activePeriod: "daily",
      });
      setResultViewModel(viewModel);
      setView("result");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setErrorMessage(msg);
      setView("input");
    }
  };

  const handleBack = () => setView("input");
  const handleRegenerate = () => {
    if (lastBirthInfo) void handleSubmit(lastBirthInfo);
  };

  const period = TAB_TO_PERIOD[activeTab] ?? "daily";
  const slice = useMemo(() => {
    if (!resultViewModel) return null;
    return getViewModelSliceForPeriod(resultViewModel, period);
  }, [resultViewModel, period]);

  return (
    <div className="min-h-screen bg-background relative">
      <StarBackground />
      <div className="relative z-10 max-w-[480px] mx-auto px-5 py-8">
        <header className="text-center mb-8">
          {view === "result" && (
            <button
              onClick={handleBack}
              className="absolute left-5 top-8 text-text-muted hover:text-text-secondary transition-colors"
            >
              ← 뒤로
            </button>
          )}
          <h1 className="text-3xl font-light tracking-tight text-text-primary mb-2" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Cosmic 五
          </h1>
          <p className="text-sm text-text-secondary">별과 오행이 읽어주는 오늘의 방향</p>
        </header>

        {view === "input" && (
          <div className="space-y-4">
            {errorMessage && (
              <div className={cn("px-4 py-3 rounded-xl text-sm", "bg-caution/10 border border-caution/20 text-text-secondary")}>
                {errorMessage}
              </div>
            )}
            <BirthInfoForm onSubmit={handleSubmit} isLoading={isSubmitting} />
          </div>
        )}

        {view === "loading" && <LoadingScreen />}

        {view === "result" && resultViewModel && slice && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <ResultTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <MetadataTags tags={resultViewModel.metadataTags} />

            <HeroSummary data={slice.heroSummary} />

            <DomainCards cards={slice.domainCards} />

            <AstrologyCard
              data={{
                sunSign: resultViewModel.astrology.sunSign,
                moonSign: resultViewModel.astrology.moonSign,
                risingSign: resultViewModel.astrology.risingSign,
                planets: resultViewModel.astrology.planets,
                insights: resultViewModel.astrology.byPeriod[period]?.interpretationFacts
                  ? [
                      resultViewModel.astrology.byPeriod[period]!.interpretationFacts.energy,
                      `연애: ${resultViewModel.astrology.byPeriod[period]!.interpretationFacts.loveStatus} (${resultViewModel.astrology.byPeriod[period]!.interpretationFacts.loveScore}/5)`,
                      `커리어: ${resultViewModel.astrology.byPeriod[period]!.interpretationFacts.careerStatus} (${resultViewModel.astrology.byPeriod[period]!.interpretationFacts.careerScore}/5)`,
                      `재물: ${resultViewModel.astrology.byPeriod[period]!.interpretationFacts.moneyStatus} (${resultViewModel.astrology.byPeriod[period]!.interpretationFacts.moneyScore}/5)`,
                      `건강: ${resultViewModel.astrology.byPeriod[period]!.interpretationFacts.healthStatus} (${resultViewModel.astrology.byPeriod[period]!.interpretationFacts.healthScore}/5, ${resultViewModel.astrology.byPeriod[period]!.interpretationFacts.bodyPart})`,
                      `행운 색: ${resultViewModel.astrology.byPeriod[period]!.interpretationFacts.luckyColor}, 숫자: ${resultViewModel.astrology.byPeriod[period]!.interpretationFacts.luckyNumber}, 시간대: ${resultViewModel.astrology.byPeriod[period]!.interpretationFacts.luckyTime}`,
                    ]
                  : ["오늘의 흐름을 편하게 받아들이세요."],
              }}
            />

            <SajuCard
              data={{
                pillars: resultViewModel.saju.rawCalculation.pillars,
                dayMaster: resultViewModel.saju.rawCalculation.dayMaster,
                strengths: [
                  `당신의 일간은 ${resultViewModel.saju.rawCalculation.ilgan}으로, ${resultViewModel.saju.interpretationFacts.dayMasterPersonality}`,
                  `장점: ${resultViewModel.saju.interpretationFacts.dayMasterStrengths}`,
                ],
                cautions: [`주의 포인트: ${resultViewModel.saju.interpretationFacts.dayMasterCautions}`],
              }}
            />

            <FiveElementsChart data={resultViewModel.fiveElements} />

            <IntegratedInsightCard
              data={{
                commonTheme: resultViewModel.styleReadyText.integratedTheme,
                cautionSignal: resultViewModel.styleReadyText.cautionSignal,
                dailyGuideline: resultViewModel.styleReadyText.dailyGuideline,
                lifetimeTheme: resultViewModel.styleReadyText.lifetimeTheme,
              }}
            />

            <WhyThisResult basedOn={resultViewModel.whyThisResult.basedOn} sections={resultViewModel.whyThisResult.sections} />

            <MicroActionCard actions={resultViewModel.microActions} />

            <button
              onClick={handleRegenerate}
              className={cn(
                "w-full h-[52px] rounded-xl font-medium text-sm",
                "bg-transparent border border-glass-border text-text-secondary",
                "transition-all duration-200 hover:bg-glass-bg flex items-center justify-center gap-2"
              )}
            >
              <span>↻</span> 다른 해석 보기
            </button>
          </div>
        )}

        <footer className="mt-12 text-center">
          <p className="text-xs text-text-muted">✦ Cosmic 五 · 별과 오행의 조화</p>
        </footer>
      </div>
    </div>
  );
}
