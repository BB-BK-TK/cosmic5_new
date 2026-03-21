"use client";

import { cn } from "@/lib/utils";
import type { HeroSummaryViewModel, MetadataTagViewModel } from "@/types/result-schema";
import { CosmicBadge, type CosmicBadgeVariant } from "@/components/ui/cosmic-badge";

interface HeroSummaryProps {
  data: HeroSummaryViewModel;
  /** If present and contained in `data.message`, that segment is tinted accent purple. */
  highlightSegment?: string;
  /** Pill row under subtitle (e.g. metadata tags). */
  tags?: MetadataTagViewModel[];
  className?: string;
}

function badgeVariantForLabel(label: string): CosmicBadgeVariant {
  if (label.includes("별")) return "purple";
  if (label.includes("일") || label.includes("생")) return "teal";
  if (label.includes("기간")) return "amber";
  return "coral";
}

function renderMessage(message: string, highlight?: string) {
  const m = message || "오늘 하루 좋은 에너지가 함께하길.";
  if (!highlight || !m.includes(highlight)) {
    return <>{m}</>;
  }
  const i = m.indexOf(highlight);
  const before = m.slice(0, i);
  const after = m.slice(i + highlight.length);
  return (
    <>
      {before}
      <span className="text-accent-purple">{highlight}</span>
      {after}
    </>
  );
}

export function HeroSummary({ data, highlightSegment, tags, className }: HeroSummaryProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[20px] border border-glass-border bg-glass-bg p-8 text-center backdrop-blur-xl",
        "animate-in fade-in slide-in-from-bottom-2 duration-500",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(155, 138, 255, 0.14) 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(94, 220, 183, 0.08) 0%, transparent 45%)",
        }}
      />
      <div className="relative z-10">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-text-muted">
          {data.dateLabel}
        </p>
        <h1 className="mb-3 text-[1.35rem] font-bold leading-snug tracking-tight text-text-primary md:text-[1.5rem]">
          {renderMessage(data.message, highlightSegment)}
        </h1>
        {data.subtitle && (
          <p className="mb-4 text-sm leading-relaxed text-text-secondary">{data.subtitle}</p>
        )}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {tags.map((tag, i) => (
              <CosmicBadge key={i} variant={badgeVariantForLabel(tag.label)}>
                <span className="text-text-muted">{tag.label}:</span>
                <span className="text-text-secondary">{tag.value}</span>
              </CosmicBadge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
