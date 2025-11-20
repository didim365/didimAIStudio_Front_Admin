// SSR 환경에서는 nginx를 통해, CSR 환경에서는 직접 API 서버로 연결
const SERVER_API_BASE_URL =
  typeof window === "undefined"
    ? process.env.NGINX_PROXY_URL // SSR 환경
    : process.env.NEXT_PUBLIC_API_BACKEND_URL; // CSR 환경

if (!SERVER_API_BASE_URL) {
  throw new Error(
    "API_BACKEND_URL or NGINX_PROXY_URL environment variable is not set"
  );
}

export { SERVER_API_BASE_URL };
