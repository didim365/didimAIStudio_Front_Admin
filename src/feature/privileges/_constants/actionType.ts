import {
  FileText,
  Zap,
  Eye,
  Edit,
  Play,
  X,
  Save,
  AlertCircle,
  LucideIcon,
} from "lucide-react";

// ActionType에 따른 Badge variant 매핑
export const ACTION_TYPE_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  READ: "outline",
  WRITE: "default",
  EXECUTE: "secondary",
  DELETE: "destructive",
  UPDATE: "default",
  PATCH: "secondary",
};

// ActionType 한글 레이블
export const ACTION_TYPE_LABELS: Record<string, string> = {
  READ: "읽기",
  WRITE: "쓰기",
  EXECUTE: "실행",
  DELETE: "삭제",
  UPDATE: "수정",
  PATCH: "부분수정",
};

// ActionType에 따른 색상 (진한 배경)
export const ACTION_TYPE_COLORS: Record<string, string> = {
  READ: "bg-blue-100 text-blue-700 border-blue-200",
  WRITE: "bg-green-100 text-green-700 border-green-200",
  EXECUTE: "bg-purple-100 text-purple-700 border-purple-200",
  DELETE: "bg-red-100 text-red-700 border-red-200",
  UPDATE: "bg-yellow-100 text-yellow-700 border-yellow-200",
  PATCH: "bg-orange-100 text-orange-700 border-orange-200",
};

// ActionType에 따른 색상 (투명한 배경 - 상세 페이지용)
export const ACTION_TYPE_COLORS_LIGHT: Record<string, string> = {
  READ: "bg-blue-500/10 text-blue-700 border-blue-200",
  WRITE: "bg-green-500/10 text-green-700 border-green-200",
  EXECUTE: "bg-purple-500/10 text-purple-700 border-purple-200",
  DELETE: "bg-red-500/10 text-red-700 border-red-200",
  UPDATE: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  PATCH: "bg-orange-500/10 text-orange-700 border-orange-200",
};

// ActionType에 따른 아이콘
export const ACTION_TYPE_ICONS: Record<string, LucideIcon> = {
  READ: Eye,
  WRITE: Edit,
  EXECUTE: Play,
  DELETE: X,
  UPDATE: Save,
  PATCH: Edit,
};

// ActionType 정보를 한번에 가져오는 헬퍼 함수
export const getActionTypeInfo = (
  actionType: string,
  useLight = false
): {
  icon: LucideIcon;
  color: string;
  label: string;
} => {
  const colorMap = useLight ? ACTION_TYPE_COLORS_LIGHT : ACTION_TYPE_COLORS;

  return {
    icon: ACTION_TYPE_ICONS[actionType] || AlertCircle,
    color: colorMap[actionType] || "bg-gray-500/10 text-gray-700 border-gray-200",
    label: ACTION_TYPE_LABELS[actionType] || actionType,
  };
};

// 액션 타입 옵션 (Select 컴포넌트용)
export const ACTION_TYPE_OPTIONS = [
  { value: "READ", label: "읽기", icon: FileText },
  { value: "WRITE", label: "쓰기", icon: Zap },
  { value: "EXECUTE", label: "실행", icon: Zap },
  { value: "DELETE", label: "삭제", icon: Zap },
  { value: "UPDATE", label: "수정", icon: Zap },
  { value: "PATCH", label: "부분수정", icon: Zap },
] as const;
