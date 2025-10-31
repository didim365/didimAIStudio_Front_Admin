import axios, { AxiosInstance } from "axios";

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
  axiosInstance[key as GatewayKey] = axios.create({
    baseURL: `/api${path}`,
  });
});

export default axiosInstance;
