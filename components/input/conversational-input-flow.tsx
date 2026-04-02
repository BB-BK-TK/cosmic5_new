"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/glass-card";
import type { BirthInfo } from "@/components/birth-info-form";
import { knownCityNames } from "@/lib/birthplace";
import { NO_STYLE_KEY, type StyleOption } from "@/components/style-selector";
import { getStylePresets } from "@/lib/data";

type StepKey = "birthDate" | "calendar" | "birthTime" | "birthPlace" | "tone";

export function ConversationalInputFlow(props: {
  onSubmit: (info: BirthInfo) => void;
  onBack?: () => void;
  isLoading?: boolean;
  className?: string;
}) {
  const [step, setStep] = useState<StepKey>("birthDate");
  const [draft, setDraft] = useState<BirthInfo>({
    name: "",
    calendarType: "solar",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    interests: [],
    toneStyle: NO_STYLE_KEY,
  });

  const cityHints = useMemo(() => knownCityNames(), []);
  const styleOptions = useMemo(
    () => [{ value: NO_STYLE_KEY, label: "기본 (클리어)" }, ...getStylePresets()],
    []
  );

  const progress = useMemo(() => {
    const order: StepKey[] = ["birthDate", "calendar", "birthTime", "birthPlace", "tone"];
    const idx = order.indexOf(step);
    return { idx: Math.max(idx, 0), total: order.length };
  }, [step]);

  const accuracy = useMemo(() => {
    const hasDate = !!draft.birthDate?.trim();
    const hasTime = !!draft.birthTime?.trim();
    const hasPlace = !!draft.birthPlace?.trim();
    if (!hasDate) return { key: "none", label: "🔴 아직 분석이 준비되지 않았어요", hint: "생년월일이 필요합니다" };
    if (!hasTime) return { key: "basic", label: "🟡 기본 분석 준비됨", hint: "출생시간을 넣으면 더 정교해져요" };
    if (!hasPlace) return { key: "time", label: "🟢 정교 분석(시간) 준비됨", hint: "출생지를 넣으면 위치 보정이 적용돼요" };
    return { key: "refined", label: "🟢 위치까지 보정됨", hint: "가장 정교한 해석 상태예요" };
  }, [draft.birthDate, draft.birthTime, draft.birthPlace]);

  const canGoNext = useMemo(() => {
    if (step === "birthDate") return /^\d{4}-\d{2}-\d{2}$/.test(draft.birthDate.trim());
    return true;
  }, [step, draft.birthDate]);

  const next = () => {
    const order: StepKey[] = ["birthDate", "calendar", "birthTime", "birthPlace", "tone"];
    const idx = order.indexOf(step);
    const nextStep = order[Math.min(idx + 1, order.length - 1)];
    setStep(nextStep);
  };
  const prev = () => {
    const order: StepKey[] = ["birthDate", "calendar", "birthTime", "birthPlace", "tone"];
    const idx = order.indexOf(step);
    const prevStep = order[Math.max(idx - 1, 0)];
    setStep(prevStep);
  };

  const submit = () => {
    props.onSubmit(draft);
  };

  return (
    <div className={cn("space-y-4", props.className)}>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={step === "birthDate" ? props.onBack : prev}
          className="text-sm font-medium text-text-muted transition-colors hover:text-text-secondary"
        >
          ← 뒤로
        </button>
        <div className="text-xs text-text-muted">
          Step {progress.idx + 1}/{progress.total}
        </div>
      </div>

      <div className="rounded-2xl border border-glass-border bg-secondary/20 px-4 py-3">
        <p className="text-sm font-medium text-text-primary">{accuracy.label}</p>
        <p className="mt-1 text-xs leading-relaxed text-text-muted">{accuracy.hint}</p>
      </div>

      {step === "birthDate" && (
        <QuestionCard
          title="언제 태어나셨나요?"
          helper="이 정보로 기본 흐름을 분석합니다"
          footer={
            <div className="flex gap-2">
              <button
                type="button"
                onClick={next}
                disabled={!canGoNext}
                className={primaryBtn(!canGoNext)}
              >
                다음
              </button>
            </div>
          }
        >
          <input
            type="date"
            value={draft.birthDate}
            onChange={(e) => setDraft((p) => ({ ...p, birthDate: e.target.value }))}
            className={inputBase}
            required
          />
          <p className="mt-2 text-xs text-text-muted">예: 1993-05-14</p>
        </QuestionCard>
      )}

      {step === "calendar" && (
        <QuestionCard
          title="양력인가요, 음력인가요?"
          helper="한국 기준에서는 음력을 사용하는 경우도 많아요"
          footer={
            <div className="flex gap-2">
              <button type="button" onClick={next} className={primaryBtn(false)}>
                다음
              </button>
            </div>
          }
        >
          <div className="grid grid-cols-2 gap-3">
            <SelectPill
              active={draft.calendarType === "solar"}
              onClick={() => setDraft((p) => ({ ...p, calendarType: "solar" }))}
              title="양력"
              desc="일반적인 생일 표기"
            />
            <SelectPill
              active={draft.calendarType === "lunar"}
              onClick={() => setDraft((p) => ({ ...p, calendarType: "lunar" }))}
              title="음력"
              desc="가족·제사 기준인 경우"
            />
          </div>
        </QuestionCard>
      )}

      {step === "birthTime" && (
        <QuestionCard
          title="태어난 시간을 알고 계신가요?"
          helper="시간을 입력하면 더 정교한 해석이 가능합니다"
          footer={
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setDraft((p) => ({ ...p, birthTime: "" }));
                  next();
                }}
                className={secondaryBtn}
              >
                모름 (건너뛰기)
              </button>
              <button type="button" onClick={next} className={primaryBtn(false)}>
                다음
              </button>
            </div>
          }
        >
          <input
            type="time"
            value={draft.birthTime}
            onChange={(e) => setDraft((p) => ({ ...p, birthTime: e.target.value }))}
            className={inputBase}
          />
          <p className="mt-2 text-xs text-text-muted">선택 입력 (정확도 상승)</p>
        </QuestionCard>
      )}

      {step === "birthPlace" && (
        <QuestionCard
          title="태어난 도시를 입력해볼까요?"
          helper="위치 기반 보정이 적용됩니다 (선택)"
          footer={
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setDraft((p) => ({ ...p, birthPlace: "" }));
                  next();
                }}
                className={secondaryBtn}
              >
                건너뛰기
              </button>
              <button type="button" onClick={next} className={primaryBtn(false)}>
                다음
              </button>
            </div>
          }
        >
          <input
            type="text"
            list="birthplace-hints-conv"
            placeholder="예: 서울, 부산, 도쿄…"
            value={draft.birthPlace}
            onChange={(e) => setDraft((p) => ({ ...p, birthPlace: e.target.value }))}
            className={inputBase}
          />
          <datalist id="birthplace-hints-conv">
            {cityHints.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </QuestionCard>
      )}

      {step === "tone" && (
        <QuestionCard
          title="어떤 톤으로 받을까요?"
          helper="원문(클리어) 또는 AI 코칭 스타일을 선택할 수 있어요"
          footer={
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={props.onBack}
                className={secondaryBtn}
                disabled={props.isLoading}
              >
                나중에 할게요
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={!draft.birthDate || !!props.isLoading}
                className={primaryBtn(!draft.birthDate || !!props.isLoading)}
              >
                {props.isLoading ? "생성 중…" : "결과 보기"}
              </button>
            </div>
          }
        >
          <div className="grid gap-2">
            {styleOptions.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setDraft((p) => ({ ...p, toneStyle: s.value as StyleOption }))}
                className={cn(
                  "w-full rounded-2xl border px-4 py-3 text-left transition-colors",
                  draft.toneStyle === s.value
                    ? "border-accent-purple/40 bg-accent-purple/[0.08]"
                    : "border-glass-border bg-secondary/20 hover:border-glass-highlight"
                )}
              >
                <p className="text-sm font-medium text-text-primary">{s.label}</p>
                <p className="mt-1 text-xs text-text-muted">
                  {s.value === NO_STYLE_KEY
                    ? "Apple·Notion 느낌으로 짧고 명확하게."
                    : "AI 코칭 스타일로 말투만 바꿉니다(사실은 유지)."}
                </p>
              </button>
            ))}
          </div>
        </QuestionCard>
      )}
    </div>
  );
}

function QuestionCard(props: {
  title: string;
  helper: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <GlassCard>
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-muted">Guided input</p>
      <h2 className="mt-2 text-lg font-semibold text-text-primary">{props.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{props.helper}</p>
      <div className="mt-4">{props.children}</div>
      <div className="mt-6">{props.footer}</div>
    </GlassCard>
  );
}

function SelectPill(props: {
  active: boolean;
  onClick: () => void;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={cn(
        "rounded-2xl border px-4 py-4 text-left transition-colors",
        props.active
          ? "border-accent-purple/40 bg-accent-purple/[0.08]"
          : "border-glass-border bg-secondary/20 hover:border-glass-highlight"
      )}
    >
      <p className="text-sm font-semibold text-text-primary">{props.title}</p>
      <p className="mt-1 text-xs leading-relaxed text-text-muted">{props.desc}</p>
    </button>
  );
}

const inputBase = cn(
  "w-full h-[52px] px-4 rounded-2xl",
  "bg-secondary border border-glass-border",
  "text-text-primary placeholder:text-text-muted",
  "focus:outline-none focus:border-accent-purple focus:shadow-[0_0_20px_rgba(139,127,212,0.2)]",
  "transition-all duration-200"
);

function primaryBtn(disabled: boolean) {
  return cn(
    "h-14 w-full rounded-2xl px-5 text-base font-medium text-white sm:w-auto",
    "bg-gradient-to-r from-accent-purple to-accent-teal",
    "transition-all duration-200",
    !disabled && "hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(139,127,212,0.28)]",
    disabled && "opacity-50 cursor-not-allowed"
  );
}

const secondaryBtn = cn(
  "h-14 w-full rounded-2xl px-5 text-base font-medium sm:w-auto",
  "border border-glass-border bg-secondary/20 text-text-primary",
  "transition-colors hover:border-glass-highlight hover:bg-secondary/30"
);

