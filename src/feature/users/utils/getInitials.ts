/**
 * 사용자 이름 또는 이메일에서 초기값을 생성
 * @param name 사용자 이름
 * @param email 사용자 이메일
 * @returns 최대 2자의 대문자 초기값
 */
export function getInitials(
  name: string | null | undefined,
  email: string
): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return email[0].toUpperCase();
}

