"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
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
import { NO_STYLE_KEY, type StyleOption } from "@/components/style-selector";
import { getStylePresets } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SajuCalculator } from "@/lib/saju-db";
import { AstrologyCalculator } from "@/lib/astrology-db";
import { runCalculations } from "@/lib/calculation-layer";
import { runInterpretation } from "@/lib/interpretation-layer";
import { buildResultViewModel, getViewModelSliceForPeriod } from "@/lib/presentation-layer";
import type { ResultViewModel } from "@/types/result-schema";
import type { AstrologyPeriodKey } from "@/types/result-schema";
import type { SynthesisOutput } from "@/types/ai-types";
import type { ReadingStyleKey } from "@/types/ai-types";

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
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(NO_STYLE_KEY);
  const [styleResultCache, setStyleResultCache] = useState<Record<string, SynthesisOutput>>({});
  const [styleLoading, setStyleLoading] = useState(false);
  const [styleError, setStyleError] = useState<string | null>(null);
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
      setSelectedStyle(birthInfo.toneStyle);
      setStyleResultCache({});
      setStyleError(null);
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

  const styleCacheKey = selectedStyle !== NO_STYLE_KEY ? `${period}:${selectedStyle}` : "";
  const displayStyleResult: SynthesisOutput | null = styleCacheKey ? styleResultCache[styleCacheKey] ?? null : null;

  const fetchStyleRewrite = useCallback(
    async (style: ReadingStyleKey) => {
      if (!resultViewModel || !slice) return;
      const key = `${period}:${style}`;
      setStyleError(null);
      setStyleLoading(true);
      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "style",
            payload: {
              promptVersion: "v1",
              style,
              interpretation: {
                heroQuote: slice.heroSummary.message,
                integratedTheme: resultViewModel.styleReadyText.integratedTheme,
                cautionSignal: resultViewModel.styleReadyText.cautionSignal,
                dailyGuideline: resultViewModel.styleReadyText.dailyGuideline,
                lifetimeTheme: resultViewModel.styleReadyText.lifetimeTheme ?? "",
              },
            },
          }),
        });
        const json = await res.json();
        if (json.ok && json.data) {
          setStyleResultCache((prev) => ({ ...prev, [key]: json.data }));
        } else {
          let msg = json.message ?? "스타일 변환에 실패했습니다.";
          if (res.status === 503) msg = "AI를 사용할 수 없습니다. 원문을 표시합니다.";
          else if (res.status === 429 || json.error === "RATE_LIMIT") msg = "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
          setStyleError(msg);
        }
      } catch (e) {
        setStyleError(e instanceof Error ? e.message : "네트워크 오류. 원문을 표시합니다.");
      } finally {
        setStyleLoading(false);
      }
    },
    [resultViewModel, slice, period]
  );

  useEffect(() => {
    if (selectedStyle === NO_STYLE_KEY || !resultViewModel || !slice) return;
    const key = `${period}:${selectedStyle}`;
    if (styleResultCache[key]) return;
    void fetchStyleRewrite(selectedStyle as ReadingStyleKey);
  }, [period, selectedStyle, resultViewModel, slice, styleResultCache, fetchStyleRewrite]);

  const handleStyleRetry = useCallback(() => {
    if (selectedStyle !== NO_STYLE_KEY) void fetchStyleRewrite(selectedStyle);
  }, [selectedStyle, fetchStyleRewrite]);

  const heroDisplay = useMemo(() => {
    if (!slice) return null;
    if (displayStyleResult) {
      return {
        ...slice.heroSummary,
        message: displayStyleResult.heroQuote,
        subtitle: displayStyleResult.lifetimeTheme || slice.heroSummary.subtitle,
      };
    }
    return slice.heroSummary;
  }, [slice, displayStyleResult]);

  const integratedDisplay = useMemo(() => {
    if (!resultViewModel) return null;
    const base = {
      commonTheme: resultViewModel.styleReadyText.integratedTheme,
      cautionSignal: resultViewModel.styleReadyText.cautionSignal,
      dailyGuideline: resultViewModel.styleReadyText.dailyGuideline,
      lifetimeTheme: resultViewModel.styleReadyText.lifetimeTheme,
    };
    if (displayStyleResult) {
      return {
        commonTheme: displayStyleResult.integratedTheme,
        cautionSignal: displayStyleResult.cautionSignal,
        dailyGuideline: displayStyleResult.dailyGuideline,
        lifetimeTheme: displayStyleResult.lifetimeTheme ?? base.lifetimeTheme,
      };
    }
    return base;
  }, [resultViewModel, displayStyleResult]);

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
          <div className="space-y-8 animate-in fade-in duration-500">
            <ResultTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Hero: main message */}
            <section className="space-y-4">
              {styleError && (
                <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-caution/10 border border-caution/20 text-sm text-text-secondary">
                  <span>{styleError}</span>
                  <button
                    type="button"
                    onClick={handleStyleRetry}
                    className="text-accent-purple hover:underline whitespace-nowrap font-medium"
                  >
                    다시 시도
                  </button>
                </div>
              )}
              {styleLoading && selectedStyle !== NO_STYLE_KEY && (
                <p className="text-sm text-text-muted text-center">선택한 표현 스타일로 변환 중입니다.</p>
              )}
              <HeroSummary data={heroDisplay ?? slice.heroSummary} />
            </section>

            {/* Identity & chart snapshot */}
            <section className="space-y-3">
              <p className="text-xs text-text-muted text-center">
                {resultViewModel.astrology.sunSign} · 일간 {resultViewModel.saju.rawCalculation.ilgan} · {resultViewModel.metadataTags.find(t => t.label === "기간")?.value ?? "오늘"}
                {selectedStyle !== NO_STYLE_KEY && (
                  <> · 표현 스타일: {getStylePresets().find(p => p.value === selectedStyle)?.label ?? selectedStyle}</>
                )}
              </p>
              <MetadataTags tags={resultViewModel.metadataTags} />
            </section>

            {/* Main interpretation */}
            <section className="space-y-4">
              <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wider">통합 해석</h2>
              <IntegratedInsightCard
                data={
                  integratedDisplay ?? {
                    commonTheme: resultViewModel.styleReadyText.integratedTheme,
                    cautionSignal: resultViewModel.styleReadyText.cautionSignal,
                    dailyGuideline: resultViewModel.styleReadyText.dailyGuideline,
                    lifetimeTheme: resultViewModel.styleReadyText.lifetimeTheme,
                  }
                }
              />
            </section>

            {/* Chart detail: astrology + saju */}
            <section className="space-y-6">
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
                personality: resultViewModel.astrology.byPeriod[period]?.personality,
                strengths: resultViewModel.astrology.byPeriod[period]?.strengths,
                cautions: resultViewModel.astrology.byPeriod[period]?.cautions,
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
                internalBalanceSummary: resultViewModel.saju.interpretationFacts.internalBalanceSummary,
                practicalAdvice: resultViewModel.saju.interpretationFacts.practicalAdvice,
              }}
            />

            <FiveElementsChart data={resultViewModel.fiveElements} />
            </section>

            {/* Domain cards */}
            <section>
              <DomainCards cards={slice.domainCards} />
            </section>

            {/* Why this reading */}
            <section>
              <WhyThisResult basedOn={resultViewModel.whyThisResult.basedOn} sections={resultViewModel.whyThisResult.sections} />
            </section>

            {/* Advice & takeaway */}
            <section>
              <MicroActionCard actions={resultViewModel.microActions} />
            </section>

            {!lastBirthInfo?.birthTime && (
              <p className="text-xs text-text-muted text-center">
                출생시간을 입력하면 일간·사주가 더 정확히 반영됩니다.
              </p>
            )}

            <button
              onClick={handleRegenerate}
              className={cn(
                "w-full h-[52px] rounded-xl font-medium text-sm",
                "bg-transparent border border-glass-border text-text-secondary",
                "transition-all duration-200 hover:bg-glass-bg hover:border-glass-border-hover flex items-center justify-center gap-2"
              )}
            >
              <span>↻</span> 다시 보기
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
