/**
 * 숫자를 한국어 형식으로 포맷팅
 */
export function formatNumber(value: unknown) {
  if (typeof value !== "number" || Number.isNaN(value)) return "N/A";
  return new Intl.NumberFormat("ko-KR").format(value);
}

/**
 * 통화를 한국어 형식으로 포맷팅
 * 비용 단위가 명확하지 않아서, 통화 기호 없이 숫자만 보기 좋게 표기
 */
export function formatCurrency(value: unknown) {
  if (typeof value !== "number" || Number.isNaN(value)) return "N/A";
  return new Intl.NumberFormat("ko-KR", {
    maximumFractionDigits: 10,
  }).format(value);
}
