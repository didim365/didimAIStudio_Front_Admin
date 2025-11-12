import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import { tokenStorage } from "./tokenStorage";
import postRefreshToken from "@/feature/login/api/postRefreshToken";

const HTTP_API_GATEWAY = {
  models: "/models",
  indexing: "/indexing",
  agent: "/agents",
  presigned: "/cloud-storage",
  tools: "/mcp-tools",
  admin: "/admin",
} as const;

type GatewayKey = keyof typeof HTTP_API_GATEWAY;

// 각 gateway별 인스턴스를 담을 객체 타입
type AxiosInstanceWithGateways = {
  [K in GatewayKey]: AxiosInstance;
};

// 토큰 재발급 중 중복 호출 방지를 위한 플래그
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: string | null) => void;
  reject: (reason?: unknown) => void;
}> = [];

// 대기 중인 요청 처리
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 로그인 페이지로 리다이렉트
const redirectToLogin = () => {
  if (typeof window !== "undefined") {
    tokenStorage.clearTokens();
    window.location.href = "/";
  }
};

// gateway별 인스턴스 생성
const axiosInstance = {} as AxiosInstanceWithGateways;

Object.entries(HTTP_API_GATEWAY).forEach(([key, path]) => {
  const instance = axios.create({
    baseURL: `/api${path}`,
  });

  // Request interceptor: 모든 요청에 Authorization 헤더 추가
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const accessToken = tokenStorage.getAccessToken();
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor: 401 에러 처리 및 토큰 재발급
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // 이미 재시도한 요청이거나 에러가 없는 경우는 그대로 반환
      if (!originalRequest || originalRequest._retry) {
        return Promise.reject(error);
      }

      // 401 에러 처리
      const isRefreshTokenRequest =
        originalRequest.url?.includes("/v1/auth/refresh");

      // refresh token 요청이 401을 반환하면 refresh token이 만료된 것이므로
      // 토큰 초기화 후 로그인 페이지로 이동
      if (error.response?.status === 401 && isRefreshTokenRequest) {
        redirectToLogin();
        return Promise.reject(error);
      }

      // 일반 요청의 401 에러이고 TOKEN_EXPIRED인 경우 처리
      if (error.response?.status === 401 && !isRefreshTokenRequest) {
        const errorData = error.response.data as {
          detail?: {
            error_code?: string;
            code?: number;
          };
        };

        if (
          errorData?.detail?.error_code === "TOKEN_EXPIRED" ||
          errorData?.detail?.code === 401001
        ) {
          // 이미 재발급 중이면 대기 큐에 추가
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                if (originalRequest.headers && token) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return instance(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          const refreshToken = tokenStorage.getRefreshToken();

          // refreshToken이 없으면 로그인 페이지로 이동
          if (!refreshToken) {
            isRefreshing = false;
            processQueue(new Error("No refresh token"), null);
            redirectToLogin();
            return Promise.reject(error);
          }

          try {
            // 새로운 accessToken 발급
            const refreshResponse = await postRefreshToken(refreshToken);
            const newAccessToken = refreshResponse.access_token;
            const newRefreshToken = refreshResponse.refresh_token;

            // 새 토큰 저장
            tokenStorage.setAccessToken(newAccessToken);
            if (newRefreshToken) {
              tokenStorage.setRefreshToken(newRefreshToken);
            }

            // 원래 요청 재시도
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }

            // 대기 중인 요청들 처리
            processQueue(null, newAccessToken);
            isRefreshing = false;

            return instance(originalRequest);
          } catch (refreshError) {
            // 재발급 실패 시 토큰 초기화 및 로그인 페이지로 이동
            isRefreshing = false;
            processQueue(refreshError, null);
            redirectToLogin();
            return Promise.reject(refreshError);
          }
        }
      }

      return Promise.reject(error);
    }
  );

  axiosInstance[key as GatewayKey] = instance;
});

export default axiosInstance;
