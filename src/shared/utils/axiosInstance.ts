import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "./tokenStorage";

const HTTP_API_GATEWAY = {
  models: "/models",
  indexing: "/indexing",
  agent: "/agents",
  presigned: "/cloud-storage",
  tools: "/mcp-tools",
  auth: "",
} as const;

type GatewayKey = keyof typeof HTTP_API_GATEWAY;

// 각 gateway별 인스턴스를 담을 객체 타입
type AxiosInstanceWithGateways = {
  [K in GatewayKey]: AxiosInstance;
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

  axiosInstance[key as GatewayKey] = instance;
});

export default axiosInstance;
