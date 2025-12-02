import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "./tokenStorage";
import { getAPIBaseURL } from "./getAPIBaseURL";

const HTTP_API_GATEWAY = {
  models: "/models",
  indexing: "/indexing",
  agent: "/agents",
  presigned: "/cloud-storage",
  tools: "/mcp-tools",
  admin: "/admin",
  auth: "/auth",
} as const;

type GatewayKey = keyof typeof HTTP_API_GATEWAY;

// 각 gateway별 인스턴스를 담을 객체 타입
type AxiosInstanceWithGateways = {
  [K in GatewayKey]: AxiosInstance;
};

// gateway별 인스턴스 생성
const axiosInstance = {} as AxiosInstanceWithGateways;

// 배열 파라미터를 반복되는 키-값 쌍으로 직렬화
// category=[3,4,5] -> category=3&category=4&category=5
const paramsSerializer = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== null && item !== undefined) {
          searchParams.append(key, String(item));
        }
      });
    } else {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
};

Object.entries(HTTP_API_GATEWAY).forEach(([key, path]) => {
  const instance = axios.create({
    baseURL: `/api${path}/v1`,
    paramsSerializer: paramsSerializer,
  });

  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      config.baseURL = `${getAPIBaseURL()}/api${path}/v1`;
      const accessToken = await tokenStorage.getAccessToken();
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor: 401 에러 처리
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      // 401 Unauthorized 에러 발생 시
      if (error.response?.status === 401) {
        // access_token 제거
        await tokenStorage.clearAccessToken();
      }
      return Promise.reject(error);
    }
  );

  axiosInstance[key as GatewayKey] = instance;
});

export default axiosInstance;
