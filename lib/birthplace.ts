export interface BirthLocation {
  name: string;
  lat: number;
  lon: number;
}

const KOREA_CITIES: BirthLocation[] = [
  { name: "서울", lat: 37.5665, lon: 126.978 },
  { name: "부산", lat: 35.1796, lon: 129.0756 },
  { name: "대구", lat: 35.8714, lon: 128.6014 },
  { name: "인천", lat: 37.4563, lon: 126.7052 },
  { name: "광주", lat: 35.1595, lon: 126.8526 },
  { name: "대전", lat: 36.3504, lon: 127.3845 },
  { name: "울산", lat: 35.5384, lon: 129.3114 },
  { name: "수원", lat: 37.2636, lon: 127.0286 },
  { name: "제주", lat: 33.4996, lon: 126.5312 },
  { name: "전주", lat: 35.8242, lon: 127.148 },
  { name: "창원", lat: 35.2281, lon: 128.6811 },
];

export function resolveBirthLocation(place?: string): BirthLocation | null {
  const q = (place || "").trim();
  if (!q) return null;
  const hit = KOREA_CITIES.find((c) => q.includes(c.name));
  return hit ?? null;
}

/**
 * Korea standard meridian = 135E (KST UTC+9).
 * Local solar-time correction (minutes) ~= 4 * (longitude - 135).
 */
export function solarTimeOffsetMinutesByLongitude(lon: number): number {
  return Math.round(4 * (lon - 135));
}

