import { format } from "date-fns";
import { ko } from "date-fns/locale";

/**
 * 날짜 문자열을 한국어 형식으로 포맷팅
 * @param dateString 날짜 문자열
 * @returns 포맷팅된 날짜 문자열 또는 "정보 없음"
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "정보 없음";
  try {
    return format(new Date(dateString), "yyyy.MM.dd", { locale: ko });
  } catch {
    return dateString;
  }
}
