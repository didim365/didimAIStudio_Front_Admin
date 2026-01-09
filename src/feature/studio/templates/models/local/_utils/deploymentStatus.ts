/**
 * 배포 상태를 한국어로 변환하는 유틸 함수
 */
export function getDeploymentStatusLabel(status: string | null | undefined): string {
  if (!status) return "알 수 없음";

  const statusMap: Record<string, string> = {
    running: "실행 중",
    pending: "대기 중",
    deploying: "배포 중",
    stopped: "중지됨",
    failed: "실패",
    error: "오류",
    completed: "완료",
    ready: "준비됨",
    unknown: "알 수 없음",
  };

  return statusMap[status.toLowerCase()] || status;
}
