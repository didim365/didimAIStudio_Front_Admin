export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: "활성",
  INACTIVE: "비활성",
  SUSPENDED: "정지",
};

/**
 * 사용자 상태를 한국어로 변환합니다.
 * @param status - 사용자 상태 (ACTIVE, INACTIVE, SUSPENDED)
 * @returns 한국어로 변환된 상태 문자열
 */
export function formatUserStatus(status: UserStatus | string): string {
  return USER_STATUS_LABELS[status as UserStatus] || status;
}
