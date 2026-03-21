# Cosmic 5 — UI & data requirements

This document ties the **on-screen result experience** to **`DB_SCHEMA_PROPOSAL.md`** and `types/db-schema.ts`. Implementation target: **오늘의 운세 (daily) only**; 주간·월간·올해(총운) 탭은 제거.

---

## 1. Fortune surface (v1)

| Requirement | Detail |
|-------------|--------|
| **Primary period** | `daily` only in UI. `reading_requests.period_key` = `'daily'` for the main flow. |
| **Removed from UI** | Weekly / monthly / yearly tabs and any copy that implies switching those horizons. |
| **Lifetime** | Still computed for **hero subtitle** / `lifetimeTheme` (인생 테마 한 줄). Not a separate tab. |

---

## 2. Result screen — components by section

### Above unlock cards (always visible on result)

| Component | Role |
|-----------|------|
| `HeroSummary` | Main quote + date + optional lifetime subtitle. |
| Identity line + `MetadataTags` | Sun sign, 일간, 기간(오늘), optional style. |

### 통합 해석 (unlock)

| Component | Data slots |
|-----------|------------|
| `IntegratedInsightCard` | `commonTheme`, `cautionSignal`, `dailyGuideline`, `lifetimeTheme` |
| `DomainCards` | Astrology **daily** domain cards + all saju domain cards |
| `WhyThisResult` | Astrology + saju rationale |
| `MicroActionCard` | Static checklist (presentation layer) |

### Astrology 분석 (unlock)

| Component | Data |
|-----------|------|
| `AstrologyCard` | Big three, planets, **daily** period insights, sign copy |

### Saju 분석 (unlock)

| Component | Data |
|-----------|------|
| `SajuCard` | Pillars, 일간, 오행 요약, 실천 |
| `FiveElementsChart` | Percent + excess/deficient |

---

## 3. Content vs calculation vs DB

| Layer | Stays in code | Moves to DB (when Supabase is on) |
|-------|----------------|-------------------------------------|
| Zodiac date math, saju pillars | ✅ `astrology-db.js`, `saju-db.js` | — |
| Sign / period tone / saju copy | TS modules today | `sign_interpretation`, `period_tone`, `saju_element_meaning`, `saju_day_master_tendency` |
| Style list | `content-provider` | `style_presets` |
| AI templates | `lib/ai/prompts.ts` | `ai_prompt_templates` |
| Saved readings | — | `reading_requests`, `raw_chart_results`, `interpreted_results`, `ai_generated_outputs` |

**Single read path in app code:** interpreters and UI presets go through **`lib/data/content-provider.ts`** so swapping to Supabase does not change `presentation-layer` or pages.

---

## 4. SQL migrations

Canonical schema: **`db/migrations/001_cosmic5_schema.sql`** (matches `DB_SCHEMA_PROPOSAL.md` §4).

---

## 5. TypeScript DB types

Mirror tables: **`types/db-schema.ts`**.

---

## 6. Constants

**`lib/data/ui-constants.ts`** — `ACTIVE_FORTUNE_PERIOD = "daily"` for build/slice/fetch keys so period logic stays consistent.
