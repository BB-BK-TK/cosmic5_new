import { useState, useEffect, useRef } from "react";

const TABS = ["통합 해석", "별자리 분석", "사주 분석"];

// --- Color tokens ---
const C = {
  bg: "rgba(10,8,20,1)",
  card: "rgba(18,15,35,0.85)",
  cardBorder: "rgba(120,100,200,0.15)",
  cardBorderHover: "rgba(160,140,240,0.25)",
  purple: "#9B8AFF",
  purpleDim: "rgba(155,138,255,0.15)",
  teal: "#5EDCB7",
  tealDim: "rgba(94,220,183,0.12)",
  coral: "#FF8A6A",
  coralDim: "rgba(255,138,106,0.10)",
  amber: "#FFBA4A",
  amberDim: "rgba(255,186,74,0.10)",
  pink: "#FF6B9D",
  pinkDim: "rgba(255,107,157,0.10)",
  textPrimary: "#E8E4F0",
  textSecondary: "rgba(200,195,220,0.7)",
  textMuted: "rgba(180,170,210,0.45)",
  gold: "#D4AF37",
  gradientPurple: "linear-gradient(135deg, #6C5CE7 0%, #A78BFA 50%, #C4B5FD 100%)",
  gradientCosmic: "linear-gradient(135deg, #1a1040 0%, #0d0620 50%, #150b30 100%)",
};

// --- Shared tiny components ---
const Badge = ({ children, color = C.purple, bg }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500,
    color, background: bg || `${color}18`, letterSpacing: 0.3,
  }}>{children}</span>
);

const ScoreBar = ({ value, max = 5, color = C.purple }) => (
  <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
    {Array.from({ length: max }).map((_, i) => (
      <div key={i} style={{
        width: 18, height: 4, borderRadius: 2,
        background: i < value ? color : "rgba(255,255,255,0.08)",
        transition: "background 0.3s",
      }} />
    ))}
    <span style={{ fontSize: 11, color: C.textSecondary, marginLeft: 4 }}>{value}/{max}</span>
  </div>
);

const SectionLabel = ({ icon, label, color = C.textSecondary }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 8, marginBottom: 14,
    fontSize: 12, fontWeight: 600, color, letterSpacing: 1.2, textTransform: "uppercase",
  }}>
    <span style={{ fontSize: 14 }}>{icon}</span>{label}
  </div>
);

const GlassCard = ({ children, style = {}, accent, onClick }) => (
  <div onClick={onClick} style={{
    background: C.card,
    border: `1px solid ${C.cardBorder}`,
    borderRadius: 16, padding: "20px 22px",
    backdropFilter: "blur(24px)",
    borderTop: accent ? `2px solid ${accent}` : undefined,
    transition: "border-color 0.3s, transform 0.2s",
    cursor: onClick ? "pointer" : "default",
    ...style,
  }}>{children}</div>
);

// ========================
// 1. HERO SUMMARY
// ========================
const HeroSummary = () => {
  const [glow, setGlow] = useState(false);
  useEffect(() => { setTimeout(() => setGlow(true), 300); }, []);
  return (
    <div style={{
      textAlign: "center", padding: "48px 24px 32px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Ambient orbs */}
      <div style={{
        position: "absolute", top: -60, left: "30%", width: 200, height: 200,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(155,138,255,0.15) 0%, transparent 70%)",
        filter: "blur(40px)", opacity: glow ? 1 : 0, transition: "opacity 1.5s",
      }} />
      <div style={{
        position: "absolute", top: -30, right: "20%", width: 160, height: 160,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(94,220,183,0.10) 0%, transparent 70%)",
        filter: "blur(40px)", opacity: glow ? 1 : 0, transition: "opacity 1.8s ease 0.3s",
      }} />

      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8, letterSpacing: 1.5, fontWeight: 500 }}>
        2026년 3월 21일 토요일
      </div>

      <h1 style={{
        fontSize: 28, fontWeight: 700, color: C.textPrimary,
        lineHeight: 1.35, margin: "0 0 12px",
        opacity: glow ? 1 : 0, transform: glow ? "translateY(0)" : "translateY(12px)",
        transition: "all 0.8s ease 0.2s",
      }}>
        변화의 에너지가 정점에 달한 날,<br/>
        <span style={{ color: C.purple }}>직관을 신뢰</span>하세요
      </h1>

      <p style={{
        fontSize: 14, color: C.textSecondary, margin: "0 auto", maxWidth: 360,
        lineHeight: 1.6,
      }}>
        사주의 수(水) 기운과 물병자리의 혁신 에너지가 만나, 새로운 통찰이 열리는 하루입니다.
      </p>

      {/* Metadata tags */}
      <div style={{
        display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 20,
      }}>
        <Badge color={C.purple}>물병자리 ☿</Badge>
        <Badge color={C.teal}>일간 壬水</Badge>
        <Badge color={C.coral}>에너지 87%</Badge>
        <Badge color={C.amber}>1992.02.14</Badge>
      </div>
    </div>
  );
};

// ========================
// 2. INTEGRATED INSIGHT
// ========================
const IntegratedInsightCard = () => {
  const themes = [
    { icon: "🎯", title: "공통 테마", desc: "직관적 판단이 논리를 앞서는 시기. 사주의 水 기운(유연함, 깊은 사고)과 물병자리의 혁신적 에너지가 동시에 활성화되어, 기존 틀을 깨는 아이디어가 떠오르기 쉽습니다.", color: C.purple },
    { icon: "⚡", title: "통합 주의사항", desc: "水 기운 과다로 우유부단해질 수 있고, 물병자리 특유의 독립성이 고립으로 이어질 수 있습니다. 중요한 결정은 신뢰할 수 있는 한 사람과 상의하세요.", color: C.coral },
    { icon: "💎", title: "통합 강점", desc: "분석력과 직관이 동시에 높아진 드문 조합. 복잡한 문제를 전체적으로 조망하면서도 핵심을 꿰뚫는 힘이 있습니다.", color: C.teal },
  ];

  return (
    <div>
      <SectionLabel icon="✦" label="통합 인사이트" color={C.purple} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {themes.map((t, i) => (
          <GlassCard key={i} accent={t.color} style={{ padding: "16px 18px" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 20, lineHeight: 1 }}>{t.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.color, marginBottom: 6 }}>{t.title}</div>
                <div style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.65 }}>{t.desc}</div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

// ========================
// 3. DOMAIN CARDS (생활 영역별 — 통합)
// ========================
const DomainCards = () => {
  const [expandedIdx, setExpandedIdx] = useState(null);

  const domains = [
    {
      area: "연애 · 관계",
      icon: "💜",
      score: 4,
      luck: "보라색 계열",
      color: C.pink,
      summary: "감정적 교류가 깊어지면서 직관적 소통이 빛나는 날. 진솔한 대화가 관계를 한 단계 끌어올리되, 말보다 경청이 더 큰 신뢰를 만듭니다.",
      astro: {
        label: "별자리",
        detail: "금성-목성 트라인(120°)이 연애 영역을 활성화. 새로운 만남보다는 기존 관계의 깊이를 더하기에 좋은 배치입니다. 감정 표현이 자연스러워지는 시기.",
      },
      saju: {
        label: "사주",
        detail: "壬水 일간의 포용력 + 오늘의 食神 기운 → 상대의 감정을 직관적으로 읽는 힘이 강해집니다. 다만 水 과다(40%)로 감정에 휩쓸릴 수 있으니, 중요한 대화 전 정리 시간을 가지세요.",
      },
    },
    {
      area: "커리어 · 업무",
      icon: "🚀",
      score: 3,
      luck: "오전 10-12시",
      color: C.purple,
      summary: "창의적 아이디어가 떠오르기 쉬운 날이지만, 실행 계획을 구체화해야 설득력이 생깁니다. 기획·전략 업무에 집중하세요.",
      astro: {
        label: "별자리",
        detail: "수성 역행 종료 직후라 커뮤니케이션 채널이 다시 열리는 시기. 밀린 이메일, 보류했던 제안을 다시 꺼내기 좋습니다. 단, 큰 결정보다는 씨앗 뿌리기에 적합.",
      },
      saju: {
        label: "사주",
        detail: "甲木(오늘 천간)과 壬水(일간)이 水生木 상생 관계. 아이디어를 현실로 싹 틔우는 에너지가 강합니다. 마감 압박이 있는 작업은 오전에 집중 — 오후엔 水 기운이 분산될 수 있습니다.",
      },
    },
    {
      area: "재물 · 금전",
      icon: "💰",
      score: 3,
      luck: "서쪽 방향",
      color: C.amber,
      summary: "충동적 소비보다 학습·자기계발에 투자하면 장기적 수익으로 돌아올 날. 저축과 정리에도 적합합니다.",
      astro: {
        label: "별자리",
        detail: "금성-목성 트라인이 재물 영역도 동시 활성화하지만, '쉽게 들어온 돈은 쉽게 나간다'는 배치. 큰 투자 결정은 자제하고, 자산 현황을 점검하는 데 에너지를 쓰세요.",
      },
      saju: {
        label: "사주",
        detail: "水生木 — 돈을 '흘려보내는' 기운이 있습니다. 단, 木은 성장을 의미하므로 교육비·책·강의 등 자기계발 지출은 좋은 씨앗이 됩니다. 금(金) 기운 부족으로 절약 의지가 약해질 수 있으니 주의.",
      },
    },
    {
      area: "건강 · 웰빙",
      icon: "🌿",
      score: 4,
      luck: "스트레칭 · 수분 섭취",
      color: C.teal,
      summary: "수분 섭취를 늘리고 가벼운 운동으로 순환을 활성화하세요. 정신적 에너지는 높지만, 신체 에너지와 균형을 맞추는 것이 핵심.",
      astro: {
        label: "별자리",
        detail: "달이 전갈자리에 위치해 감정적 에너지가 높은 날. 명상이나 저널링으로 내면을 정리하면 스트레스 해소에 큰 도움. 수면의 질에도 신경 쓰세요.",
      },
      saju: {
        label: "사주",
        detail: "水 과다 체질에 오늘도 水 기운이 더해져, 신장·방광·하체 순환에 부담이 갈 수 있습니다. 따뜻한 음료와 하체 스트레칭으로 밸런스를 잡으세요. 火 기운 보충(짧은 유산소)도 효과적.",
      },
    },
  ];

  const toggleExpand = (i) => setExpandedIdx(expandedIdx === i ? null : i);

  return (
    <div>
      <SectionLabel icon="🔮" label="생활 영역별 해석" color={C.textSecondary} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {domains.map((d, i) => {
          const isOpen = expandedIdx === i;
          return (
            <GlassCard key={i} onClick={() => toggleExpand(i)} style={{
              padding: 0, borderRadius: 14, overflow: "hidden",
              border: isOpen ? `1px solid ${d.color}30` : `1px solid ${C.cardBorder}`,
              transition: "border-color 0.3s",
            }}>
              {/* Main summary area */}
              <div style={{ padding: "16px 18px" }}>
                {/* Header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{d.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{d.area}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <ScoreBar value={d.score} color={d.color} />
                    <span style={{
                      fontSize: 14, color: C.textMuted, transition: "transform 0.3s",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}>⌄</span>
                  </div>
                </div>

                {/* Integrated summary */}
                <div style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.65, marginBottom: 10 }}>
                  {d.summary}
                </div>

                {/* Luck badge */}
                {d.luck && (
                  <Badge color={C.amber} bg={C.amberDim}>행운 키워드: {d.luck}</Badge>
                )}
              </div>

              {/* Expandable detail: why this result from each source */}
              <div style={{
                maxHeight: isOpen ? 500 : 0, overflow: "hidden",
                transition: "max-height 0.4s ease",
              }}>
                <div style={{
                  padding: "0 18px 16px",
                  borderTop: `1px solid rgba(255,255,255,0.04)`,
                }}>
                  <div style={{
                    fontSize: 11, fontWeight: 600, color: C.textMuted,
                    letterSpacing: 1, marginBottom: 12, marginTop: 14,
                  }}>
                    왜 이런 결과가 나왔나요?
                  </div>

                  {/* Astrology source */}
                  <div style={{
                    padding: "12px 14px", marginBottom: 8,
                    background: C.purpleDim, borderRadius: 10,
                    borderLeft: `3px solid ${C.purple}`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 10, color: C.purple }}>●</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: C.purple }}>{d.astro.label}</span>
                    </div>
                    <div style={{ fontSize: 12, color: C.textSecondary, lineHeight: 1.6 }}>
                      {d.astro.detail}
                    </div>
                  </div>

                  {/* Saju source */}
                  <div style={{
                    padding: "12px 14px",
                    background: C.tealDim, borderRadius: 10,
                    borderLeft: `3px solid ${C.teal}`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 10, color: C.teal }}>●</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: C.teal }}>{d.saju.label}</span>
                    </div>
                    <div style={{ fontSize: 12, color: C.textSecondary, lineHeight: 1.6 }}>
                      {d.saju.detail}
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

// ========================
// 4. TODAY'S DECISION CRITERIA
// ========================
const DecisionCriteria = () => {
  const criteria = [
    { q: "새로운 프로젝트를 시작할까?", a: "시작하되, 오늘은 기획까지만. 실행은 다음 주 火 기운이 강해질 때.", icon: "🆕" },
    { q: "고백/제안을 해도 될까?", a: "감정 전달에 좋은 날이지만, 상대의 반응을 예측하려 하지 마세요.", icon: "💌" },
    { q: "중요한 계약을 체결해도 될까?", a: "세부 조항을 한 번 더 검토하세요. 직감보다 데이터를 우선시할 것.", icon: "📝" },
  ];
  return (
    <div>
      <SectionLabel icon="⚖️" label="오늘의 선택 기준" color={C.amber} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {criteria.map((c, i) => (
          <GlassCard key={i} style={{ padding: "14px 18px" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.amber, marginBottom: 6 }}>{c.icon} {c.q}</div>
            <div style={{ fontSize: 12.5, color: C.textSecondary, lineHeight: 1.6 }}>{c.a}</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

// ========================
// 5. WHY THIS RESULT
// ========================
const WhyThisResult = () => {
  const [open, setOpen] = useState(false);
  const reasons = [
    { source: "별자리 기반", detail: "물병자리 시즌 + 수성 역행 종료 직후 → 커뮤니케이션 에너지 급상승. 금성-목성 트라인이 연애·재물 영역을 동시에 활성화.", color: C.purple },
    { source: "사주 기반", detail: "壬水 일간에 오늘의 천간 甲木이 상생 관계(水生木). 식신(食神) 기운이 발동하여 창의력·표현력이 올라가지만, 水 과다(40%)로 결단력이 약해질 수 있음.", color: C.teal },
  ];
  return (
    <GlassCard style={{ padding: "16px 18px", cursor: "pointer" }} onClick={() => setOpen(!open)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>📐 이 해석의 근거</span>
        <span style={{
          fontSize: 18, color: C.textMuted,
          transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s",
        }}>⌄</span>
      </div>
      <div style={{
        maxHeight: open ? 400 : 0, overflow: "hidden",
        transition: "max-height 0.4s ease",
      }}>
        <div style={{ paddingTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
          {reasons.map((r, i) => (
            <div key={i} style={{ paddingLeft: 12, borderLeft: `2px solid ${r.color}` }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: r.color, marginBottom: 4, letterSpacing: 0.5 }}>{r.source}</div>
              <div style={{ fontSize: 12, color: C.textSecondary, lineHeight: 1.6 }}>{r.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};

// ========================
// 6. MICRO ACTION CARD
// ========================
const MicroActionCard = () => {
  const [checks, setChecks] = useState([false, false, false]);
  const actions = [
    { text: "아침에 3분 명상으로 직관 채널 열기", time: "오전" },
    { text: "점심 후 10분 산책 — 서쪽 방향이면 더 좋음", time: "오후" },
    { text: "잠들기 전 오늘 떠오른 아이디어 1개 기록하기", time: "저녁" },
  ];
  const toggle = (i) => setChecks(p => p.map((v, j) => j === i ? !v : v));
  const done = checks.filter(Boolean).length;
  return (
    <div>
      <SectionLabel icon="✅" label="오늘의 실천" color={C.teal} />
      <GlassCard style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 12, color: C.textMuted }}>{done}/3 완료</span>
          <div style={{ width: 80, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)" }}>
            <div style={{ width: `${(done / 3) * 100}%`, height: "100%", borderRadius: 2, background: C.teal, transition: "width 0.3s" }} />
          </div>
        </div>
        {actions.map((a, i) => (
          <div key={i} onClick={() => toggle(i)} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
            borderTop: i > 0 ? `1px solid rgba(255,255,255,0.04)` : "none",
            cursor: "pointer",
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: 6, flexShrink: 0,
              border: checks[i] ? `2px solid ${C.teal}` : "2px solid rgba(255,255,255,0.12)",
              background: checks[i] ? C.tealDim : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}>
              {checks[i] && <span style={{ color: C.teal, fontSize: 12, fontWeight: 700 }}>✓</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 13, color: checks[i] ? C.textMuted : C.textPrimary,
                textDecoration: checks[i] ? "line-through" : "none",
                transition: "all 0.2s",
              }}>{a.text}</div>
            </div>
            <Badge color={C.textMuted}>{a.time}</Badge>
          </div>
        ))}
      </GlassCard>
    </div>
  );
};

// ========================
// 7. ASTROLOGY CARD (Sun/Moon/Rising + Planetary Alignment)
// ========================
const PlanetaryAlignment = () => {
  const planets = [
    { name: "Sun", sign: "물병 ♒", degree: "27°", color: C.amber, size: 42, orbit: 45 },
    { name: "Moon", sign: "전갈 ♏", degree: "14°", color: "#C0C0D0", size: 36, orbit: 75 },
    { name: "Rising", sign: "사자 ♌", degree: "8°", color: C.coral, size: 30, orbit: 105 },
    { name: "Mercury", sign: "물고기 ♓", degree: "3°", color: C.teal, size: 18, orbit: 130 },
    { name: "Venus", sign: "양 ♈", degree: "15°", color: C.pink, size: 20, orbit: 150 },
    { name: "Mars", sign: "쌍둥이 ♊", degree: "22°", color: C.coral, size: 18, orbit: 170 },
  ];

  const cx = 175, cy = 175;
  return (
    <div style={{ position: "relative" }}>
      <svg viewBox="0 0 350 350" style={{ width: "100%", maxWidth: 350, display: "block", margin: "0 auto" }}>
        {/* Orbit rings */}
        {planets.map((p, i) => (
          <circle key={i} cx={cx} cy={cy} r={p.orbit} fill="none"
            stroke="rgba(255,255,255,0.04)" strokeWidth={0.5}
            strokeDasharray={i > 2 ? "2 4" : "none"} />
        ))}

        {/* Zodiac segments (subtle) */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 - 90) * Math.PI / 180;
          const x2 = cx + Math.cos(angle) * 178;
          const y2 = cy + Math.sin(angle) * 178;
          return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2}
            stroke="rgba(255,255,255,0.02)" strokeWidth={0.5} />;
        })}

        {/* Planets */}
        {planets.map((p, i) => {
          const angle = ((i * 55 + 20) - 90) * Math.PI / 180;
          const px = cx + Math.cos(angle) * p.orbit;
          const py = cy + Math.sin(angle) * p.orbit;
          return (
            <g key={i}>
              <circle cx={px} cy={py} r={p.size / 2} fill={p.color} opacity={0.85}>
                <animate attributeName="opacity" values="0.7;0.95;0.7" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
              </circle>
              {i < 3 && (
                <text x={px} y={py + p.size / 2 + 14} textAnchor="middle"
                  fill="rgba(255,255,255,0.5)" fontSize={10} fontWeight={500}>
                  {p.name}
                </text>
              )}
            </g>
          );
        })}

        {/* Center glow */}
        <circle cx={cx} cy={cy} r={20} fill="rgba(155,138,255,0.08)" />
        <circle cx={cx} cy={cy} r={8} fill="rgba(155,138,255,0.2)" />
      </svg>

      {/* Planet legend */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12 }}>
        {planets.slice(0, 3).map((p, i) => (
          <div key={i} style={{
            textAlign: "center", padding: "10px 8px",
            background: "rgba(255,255,255,0.03)", borderRadius: 10,
          }}>
            <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>{p.name}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: p.color }}>{p.sign}</div>
            <div style={{ fontSize: 11, color: C.textSecondary }}>{p.degree}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AstrologyCard = () => {
  const insights = [
    "수성 역행 종료 → 의사소통 블록 해제, 밀린 연락에 좋은 타이밍",
    "금성-목성 트라인(120°) → 연애·사교·재물 영역 시너지",
    "달이 전갈자리 → 깊은 감정적 통찰, 표면 아래를 읽는 힘",
    "화성 쌍둥이자리 → 멀티태스킹 에너지 UP, 단 산만함 주의",
  ];

  const traits = {
    personality: "혁신적이고 독립적인 사고. 인류애적 관점에서 문제를 바라보며, 관습에 구애받지 않는 자유로운 영혼. 감정보다 논리를 우선시하는 경향이 있지만, 가까운 사람에게는 깊은 충성심을 보입니다.",
    strengths: ["독창적 사고력", "인도주의적 시각", "강한 지적 호기심", "변화에 대한 적응력"],
    cautions: ["감정 표현의 서투름", "지나친 독립성 → 고립", "현실보다 이상에 치중"],
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionLabel icon="☿" label="행성 배치" color={C.purple} />
      <PlanetaryAlignment />

      <SectionLabel icon="💫" label="기간 인사이트" color={C.purple} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {insights.map((text, i) => (
          <div key={i} style={{
            display: "flex", gap: 10, alignItems: "flex-start",
            padding: "10px 14px", background: C.purpleDim, borderRadius: 10,
          }}>
            <span style={{ color: C.purple, fontSize: 8, marginTop: 5 }}>●</span>
            <span style={{ fontSize: 12.5, color: C.textSecondary, lineHeight: 1.55 }}>{text}</span>
          </div>
        ))}
      </div>

      <SectionLabel icon="🧬" label="성격 분석" color={C.purple} />
      <GlassCard style={{ padding: "16px 18px" }}>
        <div style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.7, marginBottom: 16 }}>
          {traits.personality}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.teal, marginBottom: 8 }}>강점</div>
            {traits.strengths.map((s, i) => (
              <div key={i} style={{ fontSize: 12, color: C.textSecondary, padding: "3px 0", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: C.teal, fontSize: 8 }}>◆</span> {s}
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.coral, marginBottom: 8 }}>주의</div>
            {traits.cautions.map((c, i) => (
              <div key={i} style={{ fontSize: 12, color: C.textSecondary, padding: "3px 0", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: C.coral, fontSize: 8 }}>◆</span> {c}
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

// ========================
// 8. SAJU CARD + Five Elements Chart
// ========================
const FiveElementsChart = () => {
  const elements = [
    { name: "木", value: 15, color: "#4CAF50", label: "목", angle: -90 },
    { name: "火", value: 10, color: "#FF5252", label: "화", angle: -18 },
    { name: "土", value: 20, color: "#FFB74D", label: "토", angle: 54 },
    { name: "金", value: 15, color: "#E0E0E0", label: "금", angle: 126 },
    { name: "水", value: 40, color: "#42A5F5", label: "수", angle: 198 },
  ];

  const cx = 140, cy = 140, maxR = 100;

  const getPoint = (angle, radius) => {
    const rad = (angle) * Math.PI / 180;
    return { x: cx + Math.cos(rad) * radius, y: cy + Math.sin(rad) * radius };
  };

  const points = elements.map(e => getPoint(e.angle, (e.value / 50) * maxR));
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <div>
      <svg viewBox="0 0 280 280" style={{ width: "100%", maxWidth: 280, display: "block", margin: "0 auto" }}>
        {/* Grid pentagons */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => {
          const gridPoints = elements.map(e => getPoint(e.angle, scale * maxR));
          const d = gridPoints.map((p, j) => `${j === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
          return <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />;
        })}

        {/* Axis lines */}
        {elements.map((e, i) => {
          const outer = getPoint(e.angle, maxR);
          return <line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />;
        })}

        {/* Data shape */}
        <path d={pathD} fill="rgba(94,220,183,0.12)" stroke={C.teal} strokeWidth={1.5} />

        {/* Data points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4} fill={elements[i].color} stroke="rgba(0,0,0,0.3)" strokeWidth={1} />
        ))}

        {/* Labels */}
        {elements.map((e, i) => {
          const labelPoint = getPoint(e.angle, maxR + 22);
          return (
            <g key={i}>
              <text x={labelPoint.x} y={labelPoint.y - 6} textAnchor="middle"
                fill={e.color} fontSize={16} fontWeight={700}>{e.name}</text>
              <text x={labelPoint.x} y={labelPoint.y + 10} textAnchor="middle"
                fill="rgba(255,255,255,0.5)" fontSize={11}>{e.value}%</text>
            </g>
          );
        })}
      </svg>

      {/* Balance analysis */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "rgba(66,165,245,0.08)", borderRadius: 8 }}>
          <span style={{ fontSize: 11, color: "#42A5F5", fontWeight: 600, minWidth: 52 }}>水 과다</span>
          <span style={{ fontSize: 12, color: C.textSecondary }}>유연하나 우유부단, 감정 기복 주의</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "rgba(255,82,82,0.06)", borderRadius: 8 }}>
          <span style={{ fontSize: 11, color: "#FF5252", fontWeight: 600, minWidth: 52 }}>火 부족</span>
          <span style={{ fontSize: 12, color: C.textSecondary }}>열정·추진력 보완 필요 — 운동이 도움</span>
        </div>
      </div>
    </div>
  );
};

const SajuCard = () => {
  const pillars = [
    { label: "년주", heavenly: "壬", earthly: "申", hColor: "#42A5F5", eColor: "#E0E0E0" },
    { label: "월주", heavenly: "甲", earthly: "寅", hColor: "#4CAF50", eColor: "#4CAF50" },
    { label: "일주", heavenly: "壬", earthly: "辰", hColor: "#42A5F5", eColor: "#FFB74D", isMain: true },
    { label: "시주", heavenly: "丙", earthly: "午", hColor: "#FF5252", eColor: "#FF5252" },
  ];

  const advices = [
    { text: "水 기운을 木으로 발산하세요 — 글쓰기, 기획, 새로운 학습이 최적의 발산구입니다.", icon: "🌱" },
    { text: "火 기운 보충 — 붉은 계열 옷이나 소품으로 에너지 밸런스를 맞추세요.", icon: "🔥" },
    { text: "土의 중재력 활용 — 갈등 상황에서 중재자 역할이 자연스럽게 맡겨질 수 있습니다.", icon: "⛰️" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Four pillars */}
      <div>
        <SectionLabel icon="🏛️" label="사주팔자" color={C.teal} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {pillars.map((p, i) => (
            <div key={i} style={{
              textAlign: "center", padding: "14px 8px",
              background: p.isMain ? "rgba(94,220,183,0.08)" : "rgba(255,255,255,0.02)",
              border: p.isMain ? `1.5px solid ${C.teal}` : "1px solid rgba(255,255,255,0.05)",
              borderRadius: 12, position: "relative",
            }}>
              {p.isMain && <div style={{
                position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)",
                fontSize: 9, color: C.teal, background: C.bg, padding: "0 6px", fontWeight: 600,
              }}>일간</div>}
              <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 8 }}>{p.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: p.hColor, lineHeight: 1 }}>{p.heavenly}</div>
              <div style={{ width: "60%", height: 1, background: "rgba(255,255,255,0.06)", margin: "8px auto" }} />
              <div style={{ fontSize: 28, fontWeight: 700, color: p.eColor, lineHeight: 1 }}>{p.earthly}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Day Master explanation */}
      <GlassCard accent={C.teal} style={{ padding: "16px 18px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.teal, marginBottom: 8 }}>
          壬水 (임수) — 당신의 본질
        </div>
        <div style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.7 }}>
          큰 바다, 넓은 호수와 같은 물의 기운. 깊은 지혜와 포용력을 가졌으며,
          어떤 형태의 그릇에도 담길 수 있는 적응력이 최대 장점입니다.
          그러나 방향을 잃으면 범람하듯 감정이 통제를 벗어날 수 있고,
          너무 많은 가능성을 열어두어 결정을 미루는 경향이 있습니다.
        </div>
      </GlassCard>

      {/* Five Elements Chart */}
      <div>
        <SectionLabel icon="⚖️" label="오행 균형" color={C.teal} />
        <FiveElementsChart />
      </div>

      {/* Practical advice */}
      <div>
        <SectionLabel icon="🎯" label="실천 조언" color={C.teal} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {advices.map((a, i) => (
            <div key={i} style={{
              display: "flex", gap: 10, alignItems: "flex-start",
              padding: "12px 14px", background: C.tealDim, borderRadius: 10,
            }}>
              <span style={{ fontSize: 16 }}>{a.icon}</span>
              <span style={{ fontSize: 12.5, color: C.textSecondary, lineHeight: 1.6 }}>{a.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ========================
// MAIN APP
// ========================
export default function Cosmic5Design() {
  const [activeTab, setActiveTab] = useState(0);
  const [unlocked, setUnlocked] = useState({ 0: true, 1: true, 2: true });

  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
      color: C.textPrimary, maxWidth: 480, margin: "0 auto",
      position: "relative", overflow: "hidden",
    }}>
      {/* Ambient background */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse at 30% 20%, rgba(100,80,200,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(60,180,160,0.04) 0%, transparent 50%)",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <HeroSummary />

        {/* Tab navigation */}
        <div style={{
          display: "flex", gap: 4, padding: "0 16px", marginBottom: 24,
          position: "sticky", top: 0, zIndex: 10,
          background: "rgba(10,8,20,0.85)", backdropFilter: "blur(16px)",
          paddingTop: 12, paddingBottom: 12,
        }}>
          {TABS.map((tab, i) => (
            <button key={i} onClick={() => setActiveTab(i)} style={{
              flex: 1, padding: "10px 0", border: "none", borderRadius: 10, cursor: "pointer",
              fontSize: 13, fontWeight: activeTab === i ? 600 : 400,
              color: activeTab === i ? C.textPrimary : C.textMuted,
              background: activeTab === i
                ? (i === 0 ? "rgba(155,138,255,0.12)" : i === 1 ? "rgba(155,138,255,0.10)" : "rgba(94,220,183,0.10)")
                : "rgba(255,255,255,0.03)",
              borderBottom: activeTab === i
                ? `2px solid ${i === 2 ? C.teal : C.purple}` : "2px solid transparent",
              transition: "all 0.3s",
            }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div style={{ padding: "0 16px 80px" }}>
          {activeTab === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <IntegratedInsightCard />
              <DomainCards />
              <DecisionCriteria />
              <WhyThisResult />
              <MicroActionCard />
            </div>
          )}

          {activeTab === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <AstrologyCard />
            </div>
          )}

          {activeTab === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <SajuCard />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
