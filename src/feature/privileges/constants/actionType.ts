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

// ActionType에 따른 색상
export const ACTION_TYPE_COLORS: Record<string, string> = {
  READ: "bg-blue-100 text-blue-700 border-blue-200",
  WRITE: "bg-green-100 text-green-700 border-green-200",
  EXECUTE: "bg-purple-100 text-purple-700 border-purple-200",
  DELETE: "bg-red-100 text-red-700 border-red-200",
  UPDATE: "bg-yellow-100 text-yellow-700 border-yellow-200",
  PATCH: "bg-orange-100 text-orange-700 border-orange-200",
};

