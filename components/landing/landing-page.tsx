"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/glass-card";

export function LandingPage(props: {
  onPrimaryCta: () => void;
  onSecondaryCta: () => void;
  className?: string;
}) {
  return (
    <div className={cn("space-y-8", props.className)}>
      {/* Hero */}
      <section className="text-center">
        <div className="mb-3 flex justify-center">
          <Image
            src="/cosmic5-logo.png"
            alt="Cosmic 5"
            width={320}
            height={96}
            className="h-16 w-auto max-w-[min(100%,320px)] object-contain object-center sm:h-20"
            priority
          />
        </div>
        <h1 className="mx-auto max-w-[28ch] text-balance text-[1.65rem] font-semibold leading-tight tracking-tight text-text-primary">
          Understand today’s flow — and what to do about it
        </h1>
        <p className="mx-auto mt-3 max-w-[44ch] text-pretty text-sm leading-relaxed text-text-secondary">
          Personalized daily insight based on your birth data. Not a horoscope — a daily decision
          support system.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={props.onPrimaryCta}
            className={cn(
              "h-14 w-full rounded-2xl px-5 text-base font-medium text-white sm:w-auto",
              "bg-gradient-to-r from-accent-purple to-accent-teal",
              "transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(139,127,212,0.28)]"
            )}
          >
            See my result
          </button>
          <button
            type="button"
            onClick={props.onSecondaryCta}
            className={cn(
              "h-14 w-full rounded-2xl px-5 text-base font-medium sm:w-auto",
              "border border-glass-border bg-secondary/20 text-text-primary",
              "transition-colors hover:border-glass-highlight hover:bg-secondary/30"
            )}
          >
            Try sample first
          </button>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2 text-[12px] text-text-muted">
          <span className="rounded-full border border-glass-border bg-secondary/20 px-3 py-1">
            Takes less than 30 seconds
          </span>
          <span className="rounded-full border border-glass-border bg-secondary/20 px-3 py-1">
            Birth time optional (adds accuracy)
          </span>
          <span className="rounded-full border border-glass-border bg-secondary/20 px-3 py-1">
            No sign-up required
          </span>
        </div>
      </section>

      {/* Sample preview */}
      <section className="space-y-3">
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
          SAMPLE PREVIEW
        </p>
        <GlassCard className="p-0 overflow-hidden">
          <div className="border-b border-glass-border bg-secondary/20 p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-muted">
              Today’s one-line summary
            </p>
            <p className="mt-2 text-base font-semibold leading-snug text-text-primary">
              Today works better when you slow down instead of pushing forward.
            </p>
          </div>
          <div className="space-y-4 p-5">
            <div className="grid gap-3">
              <PreviewBullet
                label="Emotion"
                text="You’re more sensitive than usual — don’t mistake intensity for urgency."
              />
              <PreviewBullet
                label="Relationship"
                text="Avoid ‘fixing’ someone. Ask one precise question instead."
              />
              <PreviewBullet
                label="Work"
                text="Finish one open loop before starting anything new — momentum follows."
              />
            </div>
            <div className="rounded-2xl border border-accent-teal/25 bg-accent-teal/[0.08] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-teal/90">
                Action recommendation
              </p>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                Delay important conversations until the afternoon. In the morning, do one low-stakes
                task you can complete in 25 minutes.
              </p>
            </div>
          </div>
        </GlassCard>

        <p className="text-center text-xs leading-relaxed text-text-muted">
          이건 샘플이에요. 실제 결과는 <span className="text-text-secondary">생년월일(필수)</span>과{" "}
          <span className="text-text-secondary">출생시간(선택)</span>으로 더 개인화됩니다.
        </p>
      </section>
    </div>
  );
}

function PreviewBullet(props: { label: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent-purple/20 text-[11px] font-semibold text-accent-purple">
        ✦
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-text-primary">{props.label}</p>
        <p className="mt-1 text-sm leading-relaxed text-text-secondary">{props.text}</p>
      </div>
    </div>
  );
}

