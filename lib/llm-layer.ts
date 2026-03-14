/**
 * Phase 2 — Layer 4: LLM (future).
 * Placeholder only. Do not call from app until Phase 3.
 * When implemented: accepts ResultViewModel.styleReadyText (and optionally raw/interpretation),
 * returns overwrites for styleReadyText so the UI can show LLM-styled copy without changing structure.
 */

import type { ResultViewModel } from "@/types/result-schema";

export interface LLMStyleInput {
  styleReadyText: ResultViewModel["styleReadyText"];
  /** Optional: tone/style preference from user (e.g. warm, intuitive, direct). */
  toneStyle?: string;
  /** Optional: interests to emphasize. */
  interests?: string[];
}

export interface LLMStyleOutput {
  heroQuote?: string;
  integratedTheme?: string;
  cautionSignal?: string;
  dailyGuideline?: string;
  lifetimeTheme?: string;
}

/**
 * Placeholder. In Phase 3: call external LLM API, return partial overwrites for styleReadyText.
 */
export async function rewriteWithLLM(_input: LLMStyleInput): Promise<LLMStyleOutput> {
  return {};
}
