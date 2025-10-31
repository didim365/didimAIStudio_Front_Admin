/**
 * 한국 휴대전화 번호 포맷팅 함수
 * @param phone 전화번호 문자열 (숫자만 또는 하이픈 포함)
 * @returns 포맷팅된 전화번호 (예: 010-1234-5678) 또는 원본 문자열
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return "-";

  // 숫자만 추출
  const digits = phone.replace(/\D/g, "");

  // 숫자가 없는 경우 원본 반환
  if (digits.length === 0) return phone;

  // 11자리 번호 (010-1234-5678 형식)
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }

  // 10자리 번호 (010-123-4567 형식)
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // 다른 형식은 원본 반환 (이미 포맷팅되어 있을 수 있음)
  return phone;
}

