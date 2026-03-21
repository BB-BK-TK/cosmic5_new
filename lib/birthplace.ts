export interface BirthLocation {
  name: string;
  aliases?: string[];
  lat: number;
  lon: number;
  timeZone: string;
}

const CITIES: BirthLocation[] = [
  { name: "서울", aliases: ["seoul"], lat: 37.5665, lon: 126.978, timeZone: "Asia/Seoul" },
  { name: "부산", aliases: ["busan"], lat: 35.1796, lon: 129.0756, timeZone: "Asia/Seoul" },
  { name: "대구", aliases: ["daegu"], lat: 35.8714, lon: 128.6014, timeZone: "Asia/Seoul" },
  { name: "인천", aliases: ["incheon"], lat: 37.4563, lon: 126.7052, timeZone: "Asia/Seoul" },
  { name: "광주", aliases: ["gwangju"], lat: 35.1595, lon: 126.8526, timeZone: "Asia/Seoul" },
  { name: "대전", aliases: ["daejeon"], lat: 36.3504, lon: 127.3845, timeZone: "Asia/Seoul" },
  { name: "울산", aliases: ["ulsan"], lat: 35.5384, lon: 129.3114, timeZone: "Asia/Seoul" },
  { name: "제주", aliases: ["jeju"], lat: 33.4996, lon: 126.5312, timeZone: "Asia/Seoul" },
  { name: "도쿄", aliases: ["tokyo"], lat: 35.6762, lon: 139.6503, timeZone: "Asia/Tokyo" },
  { name: "베이징", aliases: ["beijing"], lat: 39.9042, lon: 116.4074, timeZone: "Asia/Shanghai" },
  { name: "뉴욕", aliases: ["new york", "nyc"], lat: 40.7128, lon: -74.006, timeZone: "America/New_York" },
  { name: "로스앤젤레스", aliases: ["los angeles", "la"], lat: 34.0522, lon: -118.2437, timeZone: "America/Los_Angeles" },
  { name: "런던", aliases: ["london"], lat: 51.5074, lon: -0.1278, timeZone: "Europe/London" },
  { name: "파리", aliases: ["paris"], lat: 48.8566, lon: 2.3522, timeZone: "Europe/Paris" },
  { name: "시드니", aliases: ["sydney"], lat: -33.8688, lon: 151.2093, timeZone: "Australia/Sydney" },
  { name: "싱가포르", aliases: ["singapore"], lat: 1.3521, lon: 103.8198, timeZone: "Asia/Singapore" },
];

export function resolveBirthLocation(place?: string): BirthLocation | null {
  const q = (place || "").trim().toLowerCase();
  if (!q) return null;
  const hit = CITIES.find((c) => q.includes(c.name.toLowerCase()) || (c.aliases ?? []).some((a) => q.includes(a)));
  return hit ?? null;
}

/**
 * Local solar-time correction (minutes) ~= 4 * (longitude - standard meridian).
 */
export function solarTimeOffsetMinutesByLongitude(lon: number, utcOffsetMinutes: number): number {
  const standardMeridian = (utcOffsetMinutes / 60) * 15;
  return Math.round(4 * (lon - standardMeridian));
}

export function getUtcOffsetMinutesAt(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const lookup = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const utc = Date.UTC(
    Number(lookup.year),
    Number(lookup.month) - 1,
    Number(lookup.day),
    Number(lookup.hour),
    Number(lookup.minute),
    Number(lookup.second)
  );
  return Math.round((utc - date.getTime()) / 60000);
}

export function knownCityNames(): string[] {
  return CITIES.map((c) => c.name);
}

