// SSR 환경에서는 nginx를 통해, CSR 환경에서는 직접 API 서버로 연결
const SERVER_API_BASE_URL =
  typeof window === "undefined"
    ? process.env.NGINX_PROXY_URL || "http://nginx:4000" // SSR 환경
    : process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://49.50.129.74"; // CSR 환경

export { SERVER_API_BASE_URL };
