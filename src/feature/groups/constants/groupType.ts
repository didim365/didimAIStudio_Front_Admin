import { Building2, Network, Users, UserCog } from "lucide-react";

/**
 * 그룹 타입 한글 매핑
 */
export const GROUP_TYPE_LABELS: Record<string, string> = {
  COMPANY: "회사",
  DEPARTMENT: "부서",
  TEAM: "팀",
  PERSONAL: "개인",
} as const;

/**
 * 그룹 타입별 아이콘
 */
export const GROUP_TYPE_ICONS: Record<string, React.ElementType> = {
  COMPANY: Building2,
  DEPARTMENT: Network,
  TEAM: Users,
  PERSONAL: UserCog,
};

/**
 * 그룹 타입별 색상 (상세 페이지용)
 */
export const GROUP_TYPE_COLORS: Record<string, string> = {
  COMPANY: "bg-blue-100 text-blue-700 border-blue-200",
  DEPARTMENT: "bg-green-100 text-green-700 border-green-200",
  TEAM: "bg-purple-100 text-purple-700 border-purple-200",
  PERSONAL: "bg-orange-100 text-orange-700 border-orange-200",
};

/**
 * 그룹 타입별 Badge variant (목록 페이지용)
 */
export const GROUP_TYPE_BADGE_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  COMPANY: "default",
  DEPARTMENT: "secondary",
  TEAM: "outline",
  PERSONAL: "destructive",
};

/**
 * 그룹 타입 옵션 목록 (폼 선택용)
 */
export const GROUP_TYPE_OPTIONS = [
  { value: "COMPANY" as const, label: "회사", icon: Building2 },
  { value: "DEPARTMENT" as const, label: "부서", icon: Network },
  { value: "TEAM" as const, label: "팀", icon: Users },
  { value: "PERSONAL" as const, label: "개인", icon: UserCog },
];

/**
 * 그룹 타입을 한글로 변환
 * @param groupType - 그룹 타입 (COMPANY, DEPARTMENT, TEAM, PERSONAL)
 * @returns 한글 그룹 타입
 */
export const getGroupTypeLabel = (groupType: string): string => {
  return GROUP_TYPE_LABELS[groupType] || groupType;
};

