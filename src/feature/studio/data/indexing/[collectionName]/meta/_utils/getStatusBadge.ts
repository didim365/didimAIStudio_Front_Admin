/**
 * 메타 데이터 상태에 따른 Badge variant와 label 반환
 * @param status 상태 문자열
 * @returns Badge variant와 label 객체
 */
export function getStatusBadge(status: string): {
  variant: "default" | "secondary" | "outline" | "destructive";
  label: string;
} {
  const statusMap: Record<
    string,
    { variant: "default" | "secondary" | "outline" | "destructive"; label: string }
  > = {
    completed: { variant: "default", label: "완료" },
    processing: { variant: "secondary", label: "처리중" },
    pending: { variant: "outline", label: "대기" },
    failed: { variant: "destructive", label: "실패" },
  };
  return statusMap[status] || { variant: "outline", label: status };
}
