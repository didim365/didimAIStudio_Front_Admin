/**
 * 컬렉션 타입에 따른 배지 variant 반환
 * @param type 컬렉션 타입 (meta/vector)
 * @returns Badge variant 문자열
 */
export function getBadgeVariant(
  type: string
): "default" | "secondary" | "outline" | "destructive" {
  switch (type) {
    case "meta":
      return "default";
    case "vector":
      return "secondary";
    default:
      return "outline";
  }
}
