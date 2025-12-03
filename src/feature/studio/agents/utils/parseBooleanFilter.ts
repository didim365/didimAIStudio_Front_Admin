/**
 * 쿼리 파라미터에서 받은 문자열 값을 boolean 또는 undefined로 변환
 * 
 * @param value - 변환할 문자열 값 ("all", "true", "false")
 * @returns boolean 값 또는 undefined ("all"인 경우)
 * 
 * @example
 * parseBooleanFilter("all") // undefined
 * parseBooleanFilter("true") // true
 * parseBooleanFilter("false") // false
 */
export function parseBooleanFilter(value: string): boolean | undefined {
  if (value === "all") return undefined;
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

