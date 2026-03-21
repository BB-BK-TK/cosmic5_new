"use client";

import { GlassCard } from "./glass-card";
import { PlanetaryAlignment } from "@/components/planetary-alignment";

interface AstrologyData {
  sunSign: string;
  moonSign: string;
  risingSign: string;
  planets: {
    name: string;
    symbol: string;
    sign: string;
    house: number;
  }[];
  insights: string[];
  /** Phase 3: per-sign interpretation */
  personality?: string;
  strengths?: string[];
  cautions?: string[];
}

interface AstrologyCardProps {
  data: AstrologyData;
}

export function AstrologyCard({ data }: AstrologyCardProps) {
  return (
    <GlassCard badge={{ label: "Astrology", variant: "purple" }}>
      <PlanetaryAlignment
        sunSign={data.sunSign}
        moonSign={data.moonSign}
        risingSign={data.risingSign}
      />

      {/* Planets — Phase 1: hide section when empty; show list when we have data (e.g. Sun). */}
      {data.planets && data.planets.length > 0 ? (
        <div className="mb-6">
          <h3 className="text-sm text-text-secondary mb-3">핵심 행성</h3>
          <div className="space-y-2">
            {data.planets.map((planet, index) => (
              <div
                key={`${planet.name}-${index}`}
                className="flex items-center text-sm text-text-primary"
              >
                <span className="text-accent-purple mr-2">
                  {index === data.planets.length - 1 ? "└" : "├"}
                </span>
                <span className="text-base mr-2">{planet.symbol}</span>
                <span className="text-text-secondary mr-1">{planet.name}</span>
                <span className="text-text-muted mx-1">→</span>
                <span>{planet.sign}</span>
                <span className="text-text-muted ml-1">·</span>
                <span className="text-text-secondary ml-1">
                  {planet.house}하우스
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-text-muted mb-6">태양만 표시됩니다. 출생시간 입력 시 달·승승 정보를 제공할 예정입니다.</p>
      )}

      {/* Phase 3: personality / strengths / cautions when present */}
      {data.personality && (
        <div className="mb-4">
          <p className="text-sm text-text-secondary leading-relaxed">{data.personality}</p>
        </div>
      )}
      {(data.strengths?.length ?? 0) > 0 && (
        <div className="mb-4">
          <h3 className="text-sm text-text-primary mb-2">강점</h3>
          <ul className="space-y-1 text-sm text-text-secondary">
            {data.strengths!.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-positive mt-0.5">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
      {(data.cautions?.length ?? 0) > 0 && (
        <div className="mb-4">
          <h3 className="text-sm text-text-primary mb-2">주의할 점</h3>
          <ul className="space-y-1 text-sm text-text-secondary">
            {data.cautions!.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-caution mt-0.5">•</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-glass-border mb-6" />

      {/* Insights — Phase 1: fallback when empty */}
      <div className="space-y-3">
        {(data.insights?.length ? data.insights : ["오늘의 흐름을 편하게 받아들이세요."]).map((insight, index) => (
          <p
            key={index}
            className="text-sm text-text-secondary leading-relaxed flex items-start gap-2"
          >
            <span className="text-accent-purple mt-0.5">•</span>
            {insight}
          </p>
        ))}
      </div>
    </GlassCard>
  );
}
