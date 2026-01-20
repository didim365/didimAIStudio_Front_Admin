/**
 * 숫자를 한국어 형식으로 포맷팅
 * @param num 포맷팅할 숫자
 * @returns 콤마가 포함된 포맷팅된 숫자 문자열
 * @example formatNumber(1234567) // "1,234,567"
 */
export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return "0";
  return new Intl.NumberFormat("ko-KR").format(num);
}
