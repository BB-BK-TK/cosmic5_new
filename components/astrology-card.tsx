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
  /** Phase 3: per-sign interpretation */
  personality?: string;
  strengthsText?: string;
  cautionsText?: string;
  luckySummary?: string;
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
        <p className="text-xs text-text-muted mb-6">
          핵심 행성 목록은 태양을 기본으로 하며, 출생 시간이 있으면 달·상승(근사)이 추가됩니다. 수·금·화 등은 추후 에페머리스 연동 예정입니다.
        </p>
      )}

      {/* Phase 3: personality / strengths / cautions when present */}
      {data.personality && (
        <div className="mb-4">
          <p className="text-sm text-text-secondary leading-relaxed">{data.personality}</p>
        </div>
      )}
      {data.strengthsText && (
        <div className="mb-4">
          <h3 className="text-sm text-text-primary mb-2">강점</h3>
          <p className="text-sm text-text-secondary leading-relaxed">{data.strengthsText}</p>
        </div>
      )}
      {data.cautionsText && (
        <div className="mb-4">
          <h3 className="text-sm text-text-primary mb-2">주의할 점</h3>
          <p className="text-sm text-text-secondary leading-relaxed">{data.cautionsText}</p>
        </div>
      )}
      {data.luckySummary && (
        <div className="mb-1">
          <h3 className="text-sm text-text-primary mb-2">행운 포인트</h3>
          <p className="text-sm text-text-secondary leading-relaxed">{data.luckySummary}</p>
        </div>
      )}
    </GlassCard>
  );
}
