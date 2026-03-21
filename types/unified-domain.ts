/**
 * Unified domain row for 통합 탭: 별자리 + 사주를 한 카드에서 펼쳐 볼 때 사용.
 * @see docs/cosmic5-ui-requirements.md
 */
export interface UnifiedDomain {
  id: string;
  area: string;
  icon: string;
  score: number;
  luck: string;
  summary: string;
  astroDetail: string;
  sajuDetail: string;
}
