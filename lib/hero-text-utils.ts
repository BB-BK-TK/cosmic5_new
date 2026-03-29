/**
 * 상단 메시지에서 태양 별자리 이름 접두어 제거 (예: "염소자리 오늘은…" → "오늘은…").
 * 스타일 변환 API 등에서 접두어가 다시 붙는 경우에도 한 번 더 정리할 때 사용.
 */
export function stripLeadingZodiacFromMessage(signKo: string, message: string): string {
  const m = (message ?? "").trim();
  const sign = (signKo ?? "").trim();
  if (!m || !sign) return m;
  if (m.startsWith(sign)) {
    const rest = m.slice(sign.length).replace(/^[\s,，.:：·\-—의]+/, "").trim();
    if (rest) return rest;
  }
  const pref = `${sign}의`;
  if (m.startsWith(pref)) {
    const rest = m.slice(pref.length).replace(/^[\s,，.:：·\-—]+/, "").trim();
    if (rest) return rest;
  }
  return m;
}

export function formatLuckyLine(color: string, number: number | string, time: string): string {
  const c = (color ?? "").trim() || "—";
  const n = number === 0 || number === "0" ? "—" : String(number);
  const t = (time ?? "").trim() || "—";
  return `행운의 색 ${c} · 숫자 ${n} · 시간대 ${t}`;
}
