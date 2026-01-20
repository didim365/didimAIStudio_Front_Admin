import { format } from "date-fns";
import { ko } from "date-fns/locale";

/**
 * 날짜 문자열 또는 Unix timestamp를 한국어 형식으로 포맷팅
 * @param dateInput 날짜 문자열 또는 Unix timestamp (초 단위)
 * @returns 포맷팅된 날짜 문자열 또는 "정보 없음" / "-"
 */
export function formatDate(
  dateInput: string | number | null | undefined
): string {
  if (!dateInput) {
    return typeof dateInput === "number" ? "-" : "정보 없음";
  }

  try {
    // Unix timestamp인 경우 (number)
    if (typeof dateInput === "number") {
      const date = new Date(dateInput * 1000);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }

    // 날짜 문자열인 경우
    return format(new Date(dateInput), "yyyy.MM.dd", { locale: ko });
  } catch {
    return typeof dateInput === "number" ? "-" : String(dateInput);
  }
}
