# Cosmic5 — UI Requirements Specification for Cursor

> **Purpose**: This document defines the UI component architecture, design system, interaction patterns, and data contracts for the Cosmic5 fortune analysis app. Use this as the single source of truth when implementing.
>
> **Target platform**: Next.js (App Router) + React 18+ + TypeScript + Tailwind CSS
>
> **Design philosophy**: Dark cosmic theme with glassmorphism. Purple (`#9B8AFF`) = astrology. Teal (`#5EDCB7`) = saju. Amber (`#FFBA4A`) = action/decision. Content is Korean-first.
>
> **Reference prototype**: See `cosmic5-ui-design.jsx` for the working React prototype of all components described below.

---

## 1. Global Design System

### 1.1 Color Tokens

Define as CSS variables in `globals.css` AND extend in `tailwind.config.ts`.

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#0A0814` | Page background |
| `--bg-card` | `rgba(18,15,35,0.85)` | Card backgrounds (glassmorphism) |
| `--bg-card-hover` | `rgba(24,20,45,0.90)` | Card hover state |
| `--border-card` | `rgba(120,100,200,0.15)` | Default card border |
| `--border-card-hover` | `rgba(160,140,240,0.25)` | Hover card border |
| `--color-purple` | `#9B8AFF` | Astrology accent |
| `--color-purple-dim` | `rgba(155,138,255,0.15)` | Astrology tinted bg |
| `--color-teal` | `#5EDCB7` | Saju accent |
| `--color-teal-dim` | `rgba(94,220,183,0.12)` | Saju tinted bg |
| `--color-coral` | `#FF8A6A` | Warning / caution |
| `--color-coral-dim` | `rgba(255,138,106,0.10)` | Warning tinted bg |
| `--color-amber` | `#FFBA4A` | Decision / luck |
| `--color-amber-dim` | `rgba(255,186,74,0.10)` | Decision tinted bg |
| `--color-pink` | `#FF6B9D` | Love / Venus |
| `--color-pink-dim` | `rgba(255,107,157,0.10)` | Love tinted bg |
| `--color-gold` | `#D4AF37` | Premium accent |
| `--text-primary` | `#E8E4F0` | Main text |
| `--text-secondary` | `rgba(200,195,220,0.7)` | Body / description |
| `--text-muted` | `rgba(180,170,210,0.45)` | Labels, timestamps |

### 1.2 Typography

- **Font family**: `'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif`
- Load via `next/font/local` or CDN
- **Scale**: 28px (hero h1) → 14px (section labels) → 13px (body) → 12px (caption) → 11px (badge) → 10px (micro-label)
- **Weights**: 400 body, 500 emphasis, 600 section label / card title, 700 hero title + saju pillar glyphs
- **Letter spacing**: Section labels = `letter-spacing: 1.2px; text-transform: uppercase`

### 1.3 Shared UI Components

Build as reusable primitives in `components/ui/`.

#### `<GlassCard>`

```ts
interface GlassCardProps {
  accent?: string;       // Top border-top color (e.g. var(--color-purple))
  onClick?: () => void;  // Makes card interactive with hover transform
  className?: string;
  children: ReactNode;
  style?: CSSProperties; // Allow padding/border overrides
}
```

Base styles:
- `background: var(--bg-card)`
- `border: 1px solid var(--border-card)`
- `border-radius: 16px`
- `padding: 20px 22px`
- `backdrop-filter: blur(24px)`
- If `accent`: `border-top: 2px solid {accent}`
- If `onClick`: hover → `border-color: var(--border-card-hover)`, `transform: scale(1.01)`
- `transition: border-color 0.3s, transform 0.2s`

#### `<Badge>`

```ts
interface BadgeProps {
  color: string;         // Text color + auto-generates 9% opacity bg
  bg?: string;           // Override background
  children: ReactNode;
}
```

Pill shape: `border-radius: 20px`, `padding: 3px 10px`, `font-size: 11px`, `font-weight: 500`.

#### `<ScoreBar>`

```ts
interface ScoreBarProps {
  value: number;   // 1–5
  max?: number;    // default 5
  color?: string;  // default var(--color-purple)
}
```

Row of `max` rectangles (18×4px, `border-radius: 2px`). Filled = `{color}`, empty = `rgba(255,255,255,0.08)`. Trailing text `{value}/{max}` in 11px `--text-secondary`.

#### `<SectionLabel>`

```ts
interface SectionLabelProps {
  icon: string;    // Emoji or symbol character
  label: string;   // Uppercase label text
  color?: string;  // default --text-secondary
}
```

Flex row. `font-size: 12px`, `font-weight: 600`, `letter-spacing: 1.2px`, `text-transform: uppercase`, `margin-bottom: 14px`.

### 1.4 Layout Constraints

- Max-width: `480px`, centered (`margin: 0 auto`)
- Mobile-first single-column layout
- Ambient background: Two large radial gradients (`position: fixed`, `pointer-events: none`)
  - Purple orb: top-left 30%, `rgba(100,80,200,0.06)`
  - Teal orb: bottom-right 70%, `rgba(60,180,160,0.04)`
- Content section padding: `0 16px 80px`

---

## 2. Page Structure & Navigation

### 2.1 Screen Hierarchy

```
[HeroSummary]                        ← Always visible, above tabs
[TabNavigation]                      ← Sticky top bar, 3 tabs
  ├─ Tab 0: "통합 해석"               ← Default active
  │   ├─ IntegratedInsightCard       (공통 테마, 주의사항, 강점)
  │   ├─ DomainCards                 (4 unified life areas, expandable)
  │   ├─ DecisionCriteria            (오늘의 선택 기준 Q&A)
  │   ├─ WhyThisResult              (근거 — collapsible)
  │   └─ MicroActionCard             (오늘의 실천 체크리스트)
  ├─ Tab 1: "별자리 분석"
  │   └─ AstrologyCard
  │       ├─ PlanetaryAlignment      (SVG orbital chart)
  │       ├─ PeriodInsights          (bullet list)
  │       └─ PersonalityAnalysis     (text + strengths/cautions grid)
  └─ Tab 2: "사주 분석"
      └─ SajuCard
          ├─ FourPillars             (4-column grid)
          ├─ DayMasterExplanation    (text card)
          ├─ FiveElementsChart       (pentagon radar SVG)
          └─ PracticalAdvice         (icon list)
```

### 2.2 Tab Navigation Component

```ts
const TABS = ["통합 해석", "별자리 분석", "사주 분석"];
```

- **Container**: flex row, `gap: 4px`, `padding: 0 16px`
- **Sticky**: `position: sticky; top: 0; z-index: 10`
- **Background**: `rgba(10,8,20,0.85)` + `backdrop-filter: blur(16px)`
- **Each tab button**: `flex: 1`, `padding: 10px 0`, `border-radius: 10px`
- **Active state**:
  - `font-weight: 600`, `color: --text-primary`
  - Background tint: Tabs 0–1 → `rgba(155,138,255,0.12)`, Tab 2 → `rgba(94,220,183,0.10)`
  - `border-bottom: 2px solid` (purple for tabs 0-1, teal for tab 2)
- **Inactive state**: `font-weight: 400`, `color: --text-muted`, `background: rgba(255,255,255,0.03)`
- `transition: all 0.3s`

---

## 3. Tab 0 — 통합 해석 (Integrated Analysis)

### 3.1 `<HeroSummary>`

**Position**: Above tab bar, always visible.

| Element | Spec |
|---------|------|
| Date line | 12px, `--text-muted`, `letter-spacing: 1.5px`, `font-weight: 500` |
| Headline (h1) | 28px/700, 2 lines. Colored keyword in `<span style="color: var(--color-purple)">` |
| Subtitle | 14px, `--text-secondary`, `max-width: 360px`, centered, `line-height: 1.6` |
| Metadata tags | Flex-wrap row, centered, `gap: 8px`. Four `<Badge>` components: zodiac sign, day master, energy %, birth date |

**Data source**: `presentation-layer.ts` → `interpretedSummary`, `energy`. With style selection: LLM rewrites via `/api/ai`.

**Animation on mount**:
- Two ambient orb `<div>`s fade in: `opacity 0→1`, `transition: opacity 1.5s` (staggered 0.3s)
- Headline: `opacity 0→1, translateY(12px→0)`, `transition: all 0.8s ease 0.2s`

### 3.2 `<IntegratedInsightCard>`

**Purpose**: 3 themed insight cards — common theme, combined cautions, combined strengths.

**Layout**: `<SectionLabel icon="✦" label="통합 인사이트">` + vertical stack, `gap: 12px`.

**Each card** (3 total):

| Field | Spec |
|-------|------|
| Container | `<GlassCard accent={themeColor}>`, `padding: 16px 18px` |
| Layout | Flex row, `gap: 12px`, `align-items: flex-start` |
| Icon | Emoji, `font-size: 20px`, `line-height: 1` |
| Title | 13px/600, accent color, `margin-bottom: 6px` |
| Description | 13px, `--text-secondary`, `line-height: 1.65` |

**Content mapping**:

| Card | Icon | Title | Accent color |
|------|------|-------|-------------|
| 1 | 🎯 | 공통 테마 | `--color-purple` |
| 2 | ⚡ | 통합 주의사항 | `--color-coral` |
| 3 | 💎 | 통합 강점 | `--color-teal` |

**Data source**: `presentation-layer.ts` → `styleReadyText`. Combines astrology period results (`interpretedSummary`, `energy`, `loveStatus`, `lifetime.summary`) with saju interpretation. With style: LLM rewrites same slots via `/api/ai`.

### 3.3 `<DomainCards>` — 생활 영역별 해석 (UNIFIED)

> **Key design decision**: Astrology and Saju insights are merged per life area into a single card. Users see ONE integrated summary per domain at the top level. Expanding the card reveals the detailed reasoning from each source (별자리 / 사주) so users understand WHY the combined result was generated.

**Section header**: `<SectionLabel icon="🔮" label="생활 영역별 해석">`

**Layout**: Vertical stack, `gap: 12px`

**State**: `expandedIdx: number | null` — only one card expanded at a time (accordion).

#### 4 Domain Cards:

| Domain | Icon | Score | Accent color |
|--------|------|-------|-------------|
| 연애 · 관계 | 💜 | 1–5 | `--color-pink` |
| 커리어 · 업무 | 🚀 | 1–5 | `--color-purple` |
| 재물 · 금전 | 💰 | 1–5 | `--color-amber` |
| 건강 · 웰빙 | 🌿 | 1–5 | `--color-teal` |

#### Card structure (each):

**Container**: `<GlassCard>` with `padding: 0`, `border-radius: 14px`, `overflow: hidden`. When expanded: `border: 1px solid {accentColor}30`. Clickable — toggles expand.

**Collapsed state (always visible)**:
```
┌─────────────────────────────────────────┐
│ 💜 연애 · 관계          ████░  4/5  ⌄  │  ← header row
│                                         │
│ 감정적 교류가 깊어지면서 직관적 소통이     │  ← integrated summary
│ 빛나는 날. 진솔한 대화가 관계를...         │     (13px, --text-secondary)
│                                         │
│ [행운 키워드: 보라색 계열]                │  ← Badge (amber)
└─────────────────────────────────────────┘
```

- **Header row**: `padding: 16px 18px`
  - Left: icon (18px) + area name (14px/600, `--text-primary`), flex row `gap: 8px`
  - Right: `<ScoreBar>` + chevron (`⌄`, 14px, `--text-muted`, rotates 180° when open)
- **Summary text**: 13px, `--text-secondary`, `line-height: 1.65`, `margin-bottom: 10px`
  - This is the **combined** interpretation — LLM merges astrology period score + saju domain tendency into one cohesive paragraph
- **Luck badge**: `<Badge color={amber}>행운 키워드: {value}</Badge>`

**Expanded state** (slides open via `max-height 0→500px`, `transition: 0.4s ease`):
```
├─────────────────────────────────────────┤
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │  ← 1px border-top divider
│                                         │
│ 왜 이런 결과가 나왔나요?                   │  ← sub-header (11px/600, --text-muted)
│                                         │
│ ┌──purple-left-border──────────────────┐│
│ │ ● 별자리                              ││  ← astrology source
│ │ 금성-목성 트라인(120°)이 연애 영역을    ││     (bg: --color-purple-dim)
│ │ 활성화. 새로운 만남보다는 기존...        ││     (12px, --text-secondary)
│ └──────────────────────────────────────┘│
│                                         │
│ ┌──teal-left-border────────────────────┐│
│ │ ● 사주                                ││  ← saju source
│ │ 壬水 일간의 포용력 + 오늘의 食神 기운   ││     (bg: --color-teal-dim)
│ │ → 상대의 감정을 직관적으로 읽는...      ││     (12px, --text-secondary)
│ └──────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

- **Sub-header**: "왜 이런 결과가 나왔나요?" — 11px/600, `--text-muted`, `letter-spacing: 1px`, `margin-top: 14px`
- **Source blocks** (2): Each has:
  - `background`: purple-dim or teal-dim
  - `border-left: 3px solid` (purple or teal)
  - `border-radius: 10px`
  - `padding: 12px 14px`
  - Label row: colored dot (10px) + source name (11px/600, accent color)
  - Detail text: 12px, `--text-secondary`, `line-height: 1.6`
  - Gap between blocks: `8px`
- Container padding: `0 18px 16px`

**Data sources**:
- `summary` field: LLM-generated combined text (or `presentation-layer.ts` combining both)
- `score`: astrology period score from `interpretAstrologyPeriod` → `astrology-content.ts`
- `luck`: astrology period lucky item from `astrology-db.js`
- `astro.detail`: `interpretAstrologyPeriod` + `astrology-content.ts` domain guidance
- `saju.detail`: `interpretSaju` + `saju-content.ts` + `DAY_MASTER_DOMAIN_TENDENCY`

**Data contract** (TypeScript):

```ts
interface UnifiedDomain {
  area: string;            // "연애 · 관계"
  icon: string;            // "💜"
  score: number;           // 1-5, from astrology period scoring
  luck?: string;           // Lucky keyword from astrology-db
  color: string;           // Accent color token
  summary: string;         // LLM-generated combined interpretation
  astro: {
    label: string;         // "별자리"
    detail: string;        // Why-explanation from astrology data
  };
  saju: {
    label: string;         // "사주"
    detail: string;        // Why-explanation from saju data
  };
}
```

### 3.4 `<DecisionCriteria>`

**Purpose**: Scenario-based Q&A — "should I do X today?"

**Layout**: `<SectionLabel icon="⚖️" label="오늘의 선택 기준" color={amber}>`. Vertical stack, `gap: 10px`.

**Each card** (3 items):
- `<GlassCard>`, `padding: 14px 18px`
- Question: 13px/600, `--color-amber`, with leading emoji
- Answer: 12.5px, `--text-secondary`, `line-height: 1.6`

**Data source**: LLM-generated combining saju + astrology signals. Stored in presentation-layer result.

### 3.5 `<WhyThisResult>`

**Purpose**: Collapsible overall reasoning section.

**Interaction**: Click to toggle. Chevron (⌄) rotates 180° on open.

**Collapsed**: `<GlassCard>` with 📐 + "이 해석의 근거" (13px/600). Chevron right-aligned.

**Expanded** (`max-height 0→400px`, `transition: 0.4s`):
- Two blocks with `border-left: 2px solid` (purple / teal)
- Each: label (11px/600, accent color) + explanation (12px, `--text-secondary`, `line-height: 1.6`)

**Data source**: `presentation-layer.ts` summaries of calculation results.

### 3.6 `<MicroActionCard>`

**Purpose**: 3-item interactive checklist.

**Layout**: `<SectionLabel icon="✅" label="오늘의 실천" color={teal}>`. Single `<GlassCard>`.

**Header**: `{done}/3 완료` (12px, `--text-muted`) + progress bar (80×4px, teal fill proportional).

**Each item** (3 total):
- Clickable row, flex, `gap: 12px`
- Checkbox: 20×20px, `border-radius: 6px`
  - Unchecked: `border: 2px solid rgba(255,255,255,0.12)`
  - Checked: `border: 2px solid var(--color-teal)`, `bg: var(--color-teal-dim)`, shows ✓
- Text: 13px. Checked → `--text-muted` + `line-through`
- Time badge: `<Badge>` — "오전" / "오후" / "저녁"
- Divider: `1px solid rgba(255,255,255,0.04)`
- State: local `useState<boolean[]>([false, false, false])`

**Data source**: Hardcoded `microActions` array in `presentation-layer.ts`. Not from saju/astrology DB.

---

## 4. Tab 1 — 별자리 분석 (Astrology Detail)

This tab provides detailed astrology-specific data that feeds INTO the integrated analysis.

### 4.1 `<PlanetaryAlignment>`

**Purpose**: SVG orbital diagram showing Sun, Moon, Rising + inner planets.

**Implementation**: `<svg viewBox="0 0 350 350">`, max-width 350px, centered.

**Elements**:

| Layer | Detail |
|-------|--------|
| Orbit rings | 6 concentric circles at radii 45, 75, 105, 130, 150, 170. `stroke: rgba(255,255,255,0.04)`, `strokeWidth: 0.5`. Outer 3 use `strokeDasharray: "2 4"` |
| Zodiac lines | 12 lines from center at 30° intervals. `stroke: rgba(255,255,255,0.02)`, `strokeWidth: 0.5` |
| Planets | 6 `<circle>` elements positioned along orbits at varying angles. Each has pulsing opacity animation (`animate attributeName="opacity" values="0.7;0.95;0.7"`, staggered duration). |
| Center | Two concentric circles: r=20 at 8% purple, r=8 at 20% purple |
| Labels | Text below each of the Big 3 (Sun/Moon/Rising): 10px, `rgba(255,255,255,0.5)` |

**Planet data**:

| Planet | Sign | Degree | Color | Size | Orbit radius |
|--------|------|--------|-------|------|-------------|
| Sun | 물병 ♒ | 27° | `--color-amber` | 42 | 45 |
| Moon | 전갈 ♏ | 14° | `#C0C0D0` | 36 | 75 |
| Rising | 사자 ♌ | 8° | `--color-coral` | 30 | 105 |
| Mercury | 물고기 ♓ | 3° | `--color-teal` | 18 | 130 |
| Venus | 양 ♈ | 15° | `--color-pink` | 20 | 150 |
| Mars | 쌍둥이 ♊ | 22° | `--color-coral` | 18 | 170 |

**Below SVG — Planet legend**: 3-column grid for Sun/Moon/Rising. Each cell: centered text, 10px label, 14px/600 colored sign, 11px degree. Background: `rgba(255,255,255,0.03)`, `border-radius: 10px`.

**Data source**: Sun/zodiac from `astrology-db.js` (birthday → sign, `SIGN_METADATA`). Moon/Rising from `presentation-layer.ts` → `estimateMoonAndRising` heuristic.

### 4.2 `<PeriodInsights>`

**Layout**: `<SectionLabel icon="💫" label="기간 인사이트">`. Vertical stack, `gap: 8px`.

**Each item**: Flex row, `gap: 10px`, `padding: 10px 14px`, `background: var(--color-purple-dim)`, `border-radius: 10px`. Purple dot (8px ●) + text (12.5px, `--text-secondary`, `line-height: 1.55`).

**Data source**: `interpretAstrologyPeriod` → `interpretationFacts`. Raw from `astrology-db.js` seed, enriched by `astrology-content.ts` → `SIGN_INTERPRETATION` / `domainGuidance`.

### 4.3 `<PersonalityAnalysis>`

**Layout**: `<SectionLabel icon="🧬" label="성격 분석">`. Single `<GlassCard>`.

| Section | Spec |
|---------|------|
| Personality text | 13px, `--text-secondary`, `line-height: 1.7`, `margin-bottom: 16px` |
| 2-column grid | `grid-template-columns: 1fr 1fr`, `gap: 12px` |
| Strengths column | Label: 11px/600, teal, `margin-bottom: 8px`. List items: 12px, `--text-secondary`, teal ◆ bullet |
| Cautions column | Label: 11px/600, coral, `margin-bottom: 8px`. List items: 12px, `--text-secondary`, coral ◆ bullet |

**Data source**: `interpretAstrologyPeriod` + `astrology-content.ts`.

---

## 5. Tab 2 — 사주 분석 (Saju Detail)

This tab provides detailed saju-specific data that feeds INTO the integrated analysis.

### 5.1 `<FourPillars>`

**Layout**: `<SectionLabel icon="🏛️" label="사주팔자">`. 4-column grid, `gap: 10px`.

**Each pillar**:
- Container: centered text, `padding: 14px 8px`, `border-radius: 12px`
- Default: `background: rgba(255,255,255,0.02)`, `border: 1px solid rgba(255,255,255,0.05)`
- **Day pillar (일주) highlighted**: `background: rgba(94,220,183,0.08)`, `border: 1.5px solid var(--color-teal)`. Floating label "일간" above card: `position: absolute; top: -8px`, 9px/600, teal, with bg matching page color
- Pillar label: 10px, `--text-muted`
- Heavenly stem: 28px/700, element-mapped color
- Divider line: 60% width, 1px, `rgba(255,255,255,0.06)`, `margin: 8px auto`
- Earthly branch: 28px/700, element-mapped color

**Pillar data** (example):

| Pillar | Label | 天干 | 地支 | 천간 color | 지지 color |
|--------|-------|------|------|-----------|-----------|
| 년주 | 년주 | 壬 | 申 | Water blue | Metal gray |
| 월주 | 월주 | 甲 | 寅 | Wood green | Wood green |
| 일주 | 일주 | 壬 | 辰 | Water blue | Earth amber |
| 시주 | 시주 | 丙 | 午 | Fire red | Fire red |

**Element colors**:
- 木 (Wood): `#4CAF50`
- 火 (Fire): `#FF5252`
- 土 (Earth): `#FFB74D`
- 金 (Metal): `#E0E0E0`
- 水 (Water): `#42A5F5`

**Data source**: `SajuCalculator` / `lib/saju-db.js`.

### 5.2 `<DayMasterExplanation>`

Single `<GlassCard accent={teal}>`, `padding: 16px 18px`.

- Title: 13px/600, teal, `margin-bottom: 8px`. Format: `{천간}{오행} ({한자읽기}) — 당신의 본질`
- Body: 13px, `--text-secondary`, `line-height: 1.7`. Multi-sentence description.

**Data source**: `saju-db.js` 천간 `해석` field.

### 5.3 `<FiveElementsChart>`

**Purpose**: Pentagon radar chart showing the five-element (오행) balance.

**Implementation**: `<svg viewBox="0 0 280 280">`, max-width 280px, centered.

**SVG layers**:
1. **Grid pentagons**: 5 concentric pentagons at 20%, 40%, 60%, 80%, 100% scale. `stroke: rgba(255,255,255,0.06)`, `strokeWidth: 0.5`
2. **Axis lines**: 5 lines from center to each vertex. Same stroke.
3. **Data shape**: `<path>` connecting 5 data points. `fill: rgba(94,220,183,0.12)`, `stroke: var(--color-teal)`, `strokeWidth: 1.5`
4. **Data points**: `<circle>` at each vertex. `r=4`, `fill: {elementColor}`, `stroke: rgba(0,0,0,0.3)`
5. **Labels**: Outside each vertex — element character (16px/700, element color) + percentage (11px, 50% white)

**Vertex layout** (5 elements at equal angles starting from top):

| Element | Angle | Color |
|---------|-------|-------|
| 木 | -90° (top) | `#4CAF50` |
| 火 | -18° | `#FF5252` |
| 土 | 54° | `#FFB74D` |
| 金 | 126° | `#E0E0E0` |
| 水 | 198° | `#42A5F5` |

**Point calculation**: `radius = (value / 50) * maxRadius`. Center at (140, 140), maxRadius = 100.

**Below chart — Balance analysis**: Vertical stack, `gap: 6px`. Each row:
- `padding: 8px 12px`, tinted background matching element color at low opacity, `border-radius: 8px`
- Label: 11px/600, element color, `min-width: 52px` (e.g. "水 과다")
- Description: 12px, `--text-secondary`

Show only elements that are 과다 (>30%) or 부족 (<12%).

**Data source**: `SajuCalculator` / `saju-db.js` computes element percentages + excess/deficient. Chart labels are component constants. Interpretation text from `saju-content.ts` → `ELEMENT_MEANINGS`.

### 5.4 `<PracticalAdvice>`

**Layout**: `<SectionLabel icon="🎯" label="실천 조언">`. Vertical stack, `gap: 8px`.

**Each item**: Flex row, `gap: 10px`, `padding: 12px 14px`, `background: var(--color-teal-dim)`, `border-radius: 10px`. Icon (16px emoji) + text (12.5px, `--text-secondary`, `line-height: 1.6`).

**Data source**: `saju-interpreter.ts` generates based on element balance. Combines `saju-content.ts` element meanings with practical recommendations.

---

## 6. Data Flow Summary

```
User input (생년월일, 성별)
  │
  ├─► SajuCalculator (saju-db.js)
  │     → 4 pillars, day master, 5-element %
  │     → saju-interpreter.ts + saju-content.ts
  │     → domain tendencies, strengths, cautions, advice
  │
  ├─► Astrology calculation (astrology-db.js)
  │     → zodiac sign, period data, scores
  │     → astrology-interpreter.ts + astrology-content.ts
  │     → Sun/Moon/Rising, period insights, personality
  │
  └─► presentation-layer.ts
        → Merges both into unified format
        → Generates: hero text, integrated insights,
           unified domain summaries, decision criteria,
           micro actions, "why" explanations
        → Optional: /api/ai LLM call to restyle in Korean

All data is local (bundled JS modules). No external DB.
Only the style rewrite hits an external LLM API.
```

---

## 7. Interaction Patterns

| Pattern | Behavior |
|---------|----------|
| Tab switching | State: `activeTab: number`. No animation between tabs — instant swap. Preserve scroll position per tab if possible. |
| Domain card expand | Accordion: only one open at a time. Click header to toggle. `max-height` transition 0.4s. Chevron rotation 180°. |
| WhyThisResult expand | Same accordion pattern. Independent of domain cards. |
| MicroAction checkboxes | Local `useState`. Toggle on click. Visual: strikethrough + muted color. Progress bar updates. No persistence. |
| HeroSummary animation | Mount-only. Orbs fade in (1.5s). Headline slides up (0.8s, 0.2s delay). No re-trigger on tab switch. |
| Planet pulse | SVG `<animate>` on opacity. Continuous, staggered per planet. Subtle (0.7↔0.95). |

---

## 8. Component File Structure (Suggested)

```
components/
  ui/
    GlassCard.tsx
    Badge.tsx
    ScoreBar.tsx
    SectionLabel.tsx
  analysis/
    HeroSummary.tsx
    TabNavigation.tsx
    integrated/
      IntegratedInsightCard.tsx
      DomainCards.tsx           ← Unified domain cards
      DecisionCriteria.tsx
      WhyThisResult.tsx
      MicroActionCard.tsx
    astrology/
      AstrologyCard.tsx
      PlanetaryAlignment.tsx   ← SVG component
      PeriodInsights.tsx
      PersonalityAnalysis.tsx
    saju/
      SajuCard.tsx
      FourPillars.tsx
      DayMasterExplanation.tsx
      FiveElementsChart.tsx    ← SVG component
      PracticalAdvice.tsx
```

---

## 9. Key Implementation Notes for Cursor

1. **Unified domain cards are the core UX differentiator.** The top-level summary per area is a COMBINED interpretation (not astrology-only or saju-only). The expand reveals the individual source reasoning. This is what makes "통합 해석" feel integrated rather than just side-by-side.

2. **Color coding is semantic.** Purple = astrology source. Teal = saju source. This color language is consistent across ALL tabs — the expand detail blocks in DomainCards use the same purple/teal coding as the dedicated tabs.

3. **All SVG charts are inline** (not chart libraries). PlanetaryAlignment and FiveElementsChart are pure SVG with computed paths. This keeps bundle size small and allows full styling control.

4. **No external DB.** All fortune data comes from bundled JS modules (`saju-db.js`, `astrology-db.js`, `saju-content.ts`, `astrology-content.ts`). The only network call is the optional LLM style rewrite via `/api/ai`.

5. **Mobile-first at 480px max-width.** All measurements assume this constraint. The 2-column grid in FourPillars is the densest layout — test on 320px viewport to ensure it doesn't break.

6. **Glassmorphism backdrop-filter** requires `will-change: transform` or similar on parent for Safari performance. Test blur rendering on iOS Safari.

7. **Pretendard font** must be loaded before first paint to avoid FOUT with Korean characters. Use `next/font` with `display: 'swap'` and preload the variable weight file.
