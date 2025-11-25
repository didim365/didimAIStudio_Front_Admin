/**
 * SSR 환경에서는 nginx를 통해, CSR 환경에서는 직접 API 서버로 연결
 * @returns API Base URL
 */
export function getAPIBaseURL(): string {
  // CSR 환경인 경우 빈 문자열 반환
  if (typeof window !== "undefined") {
    return "";
  }

  // SSR 환경인 경우
  const nodeEnv = process.env.NODE_ENV || "development";

  if (nodeEnv === "development") {
    return "http://nginx:4000";
  }

  // production 환경
  return "http://admin-api-service:8001";
}
