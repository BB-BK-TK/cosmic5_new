"use client";

import React from "react"

import { useState } from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./glass-card";

interface BirthInfoFormProps {
  onSubmit: (data: BirthInfo) => void;
  isLoading: boolean;
}

export interface BirthInfo {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  interests: string[];
  toneStyle: string;
}

const interestOptions = [
  { id: "love", label: "연애/관계" },
  { id: "career", label: "커리어" },
  { id: "health", label: "건강" },
  { id: "money", label: "재정" },
  { id: "mental", label: "멘탈" },
];

const toneOptions = [
  { id: "warm", label: "따뜻한 위로형", icon: "🎭" },
  { id: "intuitive", label: "직관적 공감형", icon: "💫" },
  { id: "direct", label: "팩트 직설형", icon: "🔥" },
];

export function BirthInfoForm({ onSubmit, isLoading }: BirthInfoFormProps) {
  const [formData, setFormData] = useState<BirthInfo>({
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    interests: [],
    toneStyle: "warm",
  });

  const toggleInterest = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter((i) => i !== id)
        : [...prev.interests, id],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <GlassCard>
        <h2 className="text-lg font-medium text-text-primary mb-4">
          출생 정보
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-2">
              생년월일 <span className="text-accent-purple">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.birthDate}
              onChange={(e) =>
                setFormData({ ...formData, birthDate: e.target.value })
              }
              className={cn(
                "w-full h-[52px] px-4 rounded-xl",
                "bg-secondary border border-glass-border",
                "text-text-primary placeholder:text-text-muted",
                "focus:outline-none focus:border-accent-purple focus:shadow-[0_0_20px_rgba(139,127,212,0.2)]",
                "transition-all duration-200"
              )}
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-2">
              태어난 시간 <span className="text-text-muted">(선택)</span>
            </label>
            <input
              type="time"
              value={formData.birthTime}
              onChange={(e) =>
                setFormData({ ...formData, birthTime: e.target.value })
              }
              className={cn(
                "w-full h-[52px] px-4 rounded-xl",
                "bg-secondary border border-glass-border",
                "text-text-primary placeholder:text-text-muted",
                "focus:outline-none focus:border-accent-purple focus:shadow-[0_0_20px_rgba(139,127,212,0.2)]",
                "transition-all duration-200"
              )}
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-2">
              출생지 <span className="text-text-muted">(선택)</span>
            </label>
            <input
              type="text"
              placeholder="예: 서울, 부산..."
              value={formData.birthPlace}
              onChange={(e) =>
                setFormData({ ...formData, birthPlace: e.target.value })
              }
              className={cn(
                "w-full h-[52px] px-4 rounded-xl",
                "bg-secondary border border-glass-border",
                "text-text-primary placeholder:text-text-muted",
                "focus:outline-none focus:border-accent-purple focus:shadow-[0_0_20px_rgba(139,127,212,0.2)]",
                "transition-all duration-200"
              )}
            />
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-lg font-medium text-text-primary mb-4">
          관심 영역
        </h2>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => toggleInterest(option.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm transition-all duration-200",
                "border",
                formData.interests.includes(option.id)
                  ? "bg-accent-purple/15 border-accent-purple text-text-primary"
                  : "bg-transparent border-glass-border text-text-secondary hover:border-glass-highlight"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-lg font-medium text-text-primary mb-4">
          말투 선택
        </h2>
        <div className="space-y-2">
          {toneOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                setFormData({ ...formData, toneStyle: option.id })
              }
              className={cn(
                "w-full p-4 rounded-xl text-left transition-all duration-200",
                "flex items-center gap-3",
                formData.toneStyle === option.id
                  ? "bg-accent-purple/15 border border-accent-purple"
                  : "bg-secondary/50 border border-transparent hover:bg-secondary"
              )}
            >
              <span className="text-xl">{option.icon}</span>
              <span
                className={cn(
                  "text-sm",
                  formData.toneStyle === option.id
                    ? "text-text-primary"
                    : "text-text-secondary"
                )}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </GlassCard>

      <button
        type="submit"
        disabled={!formData.birthDate || isLoading}
        className={cn(
          "w-full h-14 rounded-2xl font-medium text-base",
          "bg-gradient-to-r from-accent-purple to-accent-teal",
          "text-white",
          "transition-all duration-200",
          "hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(139,127,212,0.3)]",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
          "flex items-center justify-center gap-2"
        )}
      >
        {isLoading ? (
          <>
            <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            해석 중...
          </>
        ) : (
          <>
            <span>✦</span> 운세 생성하기
          </>
        )}
      </button>

      <button
        type="button"
        onClick={() =>
          onSubmit({
            birthDate: "1995-03-15",
            birthTime: "14:30",
            birthPlace: "서울",
            interests: ["career", "love"],
            toneStyle: "warm",
          })
        }
        disabled={isLoading}
        className={cn(
          "w-full h-[52px] rounded-xl font-medium text-sm",
          "bg-transparent border border-glass-border",
          "text-text-secondary",
          "transition-all duration-200",
          "hover:bg-glass-bg"
        )}
      >
        샘플로 체험하기
      </button>
    </form>
  );
}
