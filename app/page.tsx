"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Image from "next/image";
import { StarBackground } from "@/components/star-background";
import { CosmicAmbient } from "@/components/cosmic-ambient";
import { BirthInfoForm, type BirthInfo } from "@/components/birth-info-form";
import { LoadingScreen } from "@/components/loading-screen";
import { HeroSummary, WhyThisResult } from "@/components/result";
import { AstrologyCard } from "@/components/astrology-card";
import { SajuCard } from "@/components/saju-card";
import { FiveElementsChart } from "@/components/five-elements-chart";
import { IntegratedInsightCard } from "@/components/integrated-insight-card";
import { MicroActionCard } from "@/components/micro-action-card";
import { AnalysisTabNav } from "@/components/analysis-tab-nav";
import { UnifiedDomainCards } from "@/components/unified-domain-cards";
import { NO_STYLE_KEY, type StyleOption } from "@/components/style-selector";
import { getStylePresets, ACTIVE_FORTUNE_PERIOD } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SajuCalculator } from "@/lib/saju-db";
import { AstrologyCalculator } from "@/lib/astrology-db";
import { runCalculations } from "@/lib/calculation-layer";
import { runInterpretation } from "@/lib/interpretation-layer";
import { buildResultViewModel, getViewModelSliceForPeriod } from "@/lib/presentation-layer";
import { buildDecisionCriteria } from "@/lib/decision-criteria";
import { buildUnifiedDomains } from "@/lib/unified-domains";
import type { ResultViewModel } from "@/types/result-schema";
import type { SynthesisOutput, AstrologyDetailRewriteOutput } from "@/types/ai-types";
import type { ReadingStyleKey } from "@/types/ai-types";

export default function CosmicFivePage() {
  const [view, setView] = useState<"input" | "loading" | "result">("input");
  const [resultViewModel, setResultViewModel] = useState<ResultViewModel | null>(null);
  const [lastBirthInfo, setLastBirthInfo] = useState<BirthInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(NO_STYLE_KEY);
  const [styleResultCache, setStyleResultCache] = useState<Record<string, SynthesisOutput>>({});
  const [styleLoading, setStyleLoading] = useState(false);
  const [styleError, setStyleError] = useState<string | null>(null);
  const [astroDetailCache, setAstroDetailCache] = useState<Record<string, AstrologyDetailRewriteOutput>>({});
  const [astroDetailLoading, setAstroDetailLoading] = useState(false);
  const [astroDetailError, setAstroDetailError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const isSubmitting = view === "loading";
  const astrologyCalculator = new AstrologyCalculator();
  const sajuCalculator = new SajuCalculator();

  const handleSubmit = async (birthInfo: BirthInfo) => {
    setLastBirthInfo(birthInfo);
    setView("loading");
    setErrorMessage(null);
    try {
      const calculation = runCalculations(
        birthInfo.birthDate,
        birthInfo.birthTime || "12:00",
        astrologyCalculator,
        sajuCalculator
      );
      const interpretation = runInterpretation(calculation);
      const viewModel = buildResultViewModel(calculation, interpretation, {
        birthDate: birthInfo.birthDate,
        birthTime: birthInfo.birthTime,
        activePeriod: ACTIVE_FORTUNE_PERIOD,
      });
      setResultViewModel(viewModel);
      setSelectedStyle(birthInfo.toneStyle);
      setStyleResultCache({});
      setAstroDetailCache({});
      setStyleError(null);
      setAstroDetailError(null);
      setActiveTab(0);
      window.scrollTo({ top: 0, behavior: "auto" });
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

  useEffect(() => {
    if (view !== "result") return;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [view]);

  const period = ACTIVE_FORTUNE_PERIOD;
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

  const fetchAstroDetailRewrite = useCallback(async () => {
    if (!resultViewModel) return;
    const astro = resultViewModel.astrology.byPeriod[period];
    if (!astro) return;
    const key = `${period}:${resultViewModel.astrology.sunSign}`;
    setAstroDetailError(null);
    setAstroDetailLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "astrology_detail",
          payload: {
            promptVersion: "v1",
            sign: resultViewModel.astrology.sunSign,
            period,
            personality: astro.personality,
            strengths: astro.strengths ?? [],
            cautions: astro.cautions ?? [],
            lucky: {
              color: astro.interpretationFacts.luckyColor,
              number: astro.interpretationFacts.luckyNumber,
              time: astro.interpretationFacts.luckyTime,
            },
          },
        }),
      });
      const json = await res.json();
      if (json.ok && json.data) {
        setAstroDetailCache((prev) => ({ ...prev, [key]: json.data as AstrologyDetailRewriteOutput }));
      } else {
        let msg = json.message ?? "별자리 해석 확장에 실패했습니다.";
        if (res.status === 503) msg = "AI를 사용할 수 없습니다. 기본 문구를 표시합니다.";
        else if (res.status === 429 || json.error === "RATE_LIMIT") msg = "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
        setAstroDetailError(msg);
      }
    } catch (e) {
      setAstroDetailError(e instanceof Error ? e.message : "네트워크 오류. 기본 문구를 표시합니다.");
    } finally {
      setAstroDetailLoading(false);
    }
  }, [resultViewModel, period]);

  useEffect(() => {
    if (!resultViewModel) return;
    const key = `${period}:${resultViewModel.astrology.sunSign}`;
    if (astroDetailCache[key]) return;
    void fetchAstroDetailRewrite();
  }, [resultViewModel, period, astroDetailCache, fetchAstroDetailRewrite]);

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

  const energyHighlight = resultViewModel?.astrology.byPeriod[period]?.interpretationFacts?.energy;

  const integratedDisplay = useMemo(() => {
    if (!resultViewModel) return null;
    const base = {
      commonTheme: resultViewModel.styleReadyText.integratedTheme,
      cautionSignal: resultViewModel.styleReadyText.cautionSignal,
      dailyGuideline: resultViewModel.styleReadyText.dailyGuideline,
      lifetimeTheme: resultViewModel.styleReadyText.lifetimeTheme,
      integratedStrength: resultViewModel.saju.interpretationFacts.dayMasterStrengths,
    };
    if (displayStyleResult) {
      return {
        commonTheme: displayStyleResult.integratedTheme,
        cautionSignal: displayStyleResult.cautionSignal,
        dailyGuideline: displayStyleResult.dailyGuideline,
        lifetimeTheme: displayStyleResult.lifetimeTheme ?? base.lifetimeTheme,
        integratedStrength: base.integratedStrength,
      };
    }
    return base;
  }, [resultViewModel, displayStyleResult]);

  const decisionItems = useMemo(() => {
    if (!integratedDisplay) return [];
    return buildDecisionCriteria({
      dailyGuideline: integratedDisplay.dailyGuideline,
      cautionSignal: integratedDisplay.cautionSignal,
      commonTheme: integratedDisplay.commonTheme,
    });
  }, [integratedDisplay]);

  const unifiedDomains = useMemo(() => {
    if (!resultViewModel) return [];
    return buildUnifiedDomains(resultViewModel, period);
  }, [resultViewModel, period]);

  const astroDetailKey = resultViewModel ? `${period}:${resultViewModel.astrology.sunSign}` : "";
  const astroDetail = astroDetailKey ? astroDetailCache[astroDetailKey] : null;

  return (
    <div className="relative min-h-screen bg-background">
      <CosmicAmbient />
      <StarBackground />
      <div className="relative z-10 mx-auto max-w-[480px] px-5 py-8">
        <header className="mb-8 text-center">
          {view === "result" && (
            <button
              type="button"
              onClick={handleBack}
              className="absolute left-5 top-8 text-text-muted transition-colors hover:text-text-secondary"
            >
              ← 뒤로
            </button>
          )}
          <div className="mb-2 flex justify-center">
            <Image
              src="/cosmic5-logo.png"
              alt="Cosmic 5"
              width={320}
              height={96}
              className="h-20 w-auto max-w-[min(100%,360px)] object-contain object-center sm:h-24"
              priority
            />
          </div>
          <p className="text-sm text-text-secondary">별과 오행이 읽어주는 오늘의 방향</p>
        </header>

        {view === "input" && (
          <div className="space-y-4">
            {errorMessage && (
              <div
                className={cn(
                  "rounded-xl border border-caution/20 bg-caution/10 px-4 py-3 text-sm text-text-secondary"
                )}
              >
                {errorMessage}
              </div>
            )}
            <BirthInfoForm onSubmit={handleSubmit} isLoading={isSubmitting} />
          </div>
        )}

        {view === "loading" && <LoadingScreen />}

        {view === "result" && resultViewModel && slice && (
          <div className="animate-in fade-in space-y-6 duration-500">
            <div className="mb-2 border-b border-glass-border pb-3">
              <p className="text-center text-sm font-medium tracking-wide text-text-primary">오늘의 운세</p>
            </div>

            <AnalysisTabNav activeIndex={activeTab} onChange={setActiveTab} />

            {styleError && (
              <div className="flex items-center justify-between gap-2 rounded-xl border border-caution/20 bg-caution/10 px-4 py-3 text-sm text-text-secondary">
                <span>{styleError}</span>
                <button
                  type="button"
                  onClick={handleStyleRetry}
                  className="whitespace-nowrap font-medium text-accent-purple hover:underline"
                >
                  다시 시도
                </button>
              </div>
            )}
            {styleLoading && selectedStyle !== NO_STYLE_KEY && (
              <p className="text-center text-sm text-text-muted">선택한 표현 스타일로 변환 중입니다.</p>
            )}
            {activeTab === 1 && astroDetailLoading && (
              <p className="text-center text-sm text-text-muted">별자리 강점/주의를 더 자세히 정리 중입니다.</p>
            )}
            {activeTab === 1 && astroDetailError && (
              <p className="text-center text-xs text-caution">{astroDetailError}</p>
            )}

            {/* Tab: 통합 해석 */}
            {activeTab === 0 && (
              <section className="space-y-6">
                <HeroSummary
                  data={heroDisplay ?? slice.heroSummary}
                  highlightSegment={energyHighlight}
                  tags={resultViewModel.metadataTags}
                />
                {selectedStyle !== NO_STYLE_KEY && (
                  <p className="text-center text-xs text-text-muted">
                    표현 스타일: {getStylePresets().find((p) => p.value === selectedStyle)?.label ?? selectedStyle}
                  </p>
                )}
                <IntegratedInsightCard
                  criteria={decisionItems}
                  data={
                    integratedDisplay ?? {
                      commonTheme: resultViewModel.styleReadyText.integratedTheme,
                      cautionSignal: resultViewModel.styleReadyText.cautionSignal,
                      dailyGuideline: resultViewModel.styleReadyText.dailyGuideline,
                      lifetimeTheme: resultViewModel.styleReadyText.lifetimeTheme,
                    }
                  }
                />
                <UnifiedDomainCards domains={unifiedDomains} />
                <WhyThisResult basedOn={resultViewModel.whyThisResult.basedOn} sections={resultViewModel.whyThisResult.sections} />
                <MicroActionCard actions={resultViewModel.microActions} />
              </section>
            )}

            {/* Tab: 별자리 */}
            {activeTab === 1 && (
              <section className="space-y-4">
                <AstrologyCard
                  data={{
                    sunSign: resultViewModel.astrology.sunSign,
                    moonSign: resultViewModel.astrology.moonSign,
                    risingSign: resultViewModel.astrology.risingSign,
                    planets: resultViewModel.astrology.planets,
                    personality: resultViewModel.astrology.byPeriod[period]?.personality,
                    strengthsText:
                      astroDetail?.strengthsExpanded ??
                      (resultViewModel.astrology.byPeriod[period]?.strengths ?? []).join(" "),
                    cautionsText:
                      astroDetail?.cautionsExpanded ??
                      (resultViewModel.astrology.byPeriod[period]?.cautions ?? []).join(" "),
                    luckySummary:
                      astroDetail?.luckySummary ??
                      (resultViewModel.astrology.byPeriod[period]
                        ? `행운의 색은 ${resultViewModel.astrology.byPeriod[period]!.interpretationFacts.luckyColor}, 숫자는 ${resultViewModel.astrology.byPeriod[period]!.interpretationFacts.luckyNumber}, 시간대는 ${resultViewModel.astrology.byPeriod[period]!.interpretationFacts.luckyTime}입니다.`
                        : undefined),
                  }}
                />
              </section>
            )}

            {/* Tab: 사주 */}
            {activeTab === 2 && (
              <section className="space-y-4">
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
                {!lastBirthInfo?.birthTime && (
                  <p className="text-center text-xs text-text-muted">
                    출생시간을 입력하면 일간·사주가 더 정확히 반영됩니다.
                  </p>
                )}
              </section>
            )}

            <button
              type="button"
              onClick={handleRegenerate}
              className={cn(
                "flex h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-glass-border bg-transparent text-sm font-medium text-text-secondary",
                "transition-all duration-200 hover:border-glass-border-hover hover:bg-glass-bg"
              )}
            >
              <span>↻</span> 다시 보기
            </button>
          </div>
        )}

        <footer className="mt-12 text-center">
          <p className="text-xs text-text-muted">✦ 별과 오행의 조화</p>
        </footer>
      </div>
    </div>
  );
}
