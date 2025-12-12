/**
 * 문자열에서 이니셜 추출
 * 기본값은 "M"
 */
export function getInitials(value?: string | null) {
  const text = (value ?? "").trim();
  if (!text) return "M";
  const parts = text.split(/\s+/).filter(Boolean);
  const initials = parts
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
  return initials || text[0]?.toUpperCase() || "M";
}
