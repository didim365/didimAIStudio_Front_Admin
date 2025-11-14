/**
 * 한국 휴대전화 번호 포맷팅 함수
 * 입력 중인 전화번호나 완성된 전화번호 모두를 포맷팅합니다.
 *
 * @param phone 전화번호 문자열 (숫자만, 하이픈 포함, 또는 null/undefined)
 * @returns 포맷팅된 전화번호 (예: "010-1234-5678"), null/undefined인 경우 "-"
 *
 * @example
 * formatPhoneNumber("01012345678") // "010-1234-5678"
 * formatPhoneNumber("010-1234-5678") // "010-1234-5678"
 * formatPhoneNumber("010123") // "010-123" (입력 중)
 * formatPhoneNumber(null) // "-"
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  // null/undefined 처리
  if (!phone) return "-";

  // 숫자만 추출
  const digits = phone.replace(/\D/g, "");

  // 숫자가 없는 경우 원본 반환 (이미 포맷팅되어 있을 수 있음)
  if (digits.length === 0) return phone;

  // 포맷팅 적용
  if (digits.length === 11) {
    // 11자리 번호 (010-1234-5678 형식)
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  } else if (digits.length === 10) {
    // 10자리 번호 (010-123-4567 형식)
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length > 0) {
    // 입력 중일 때는 부분적으로 포맷팅
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 7) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    }
  }

  return phone;
}
