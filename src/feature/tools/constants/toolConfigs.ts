import { Server, Container, Globe, Zap } from "lucide-react";
import { components } from "@/shared/types/api/tools";

// API 타입에서 가져오기
export type MCPToolProvider = components["schemas"]["MCPToolProvider"];
export type MCPToolCategory = components["schemas"]["MCPToolCategory"];
export type MCPToolDeploymentType =
  components["schemas"]["MCPToolDeploymentType"];

export const statusConfig = {
  ACTIVE: {
    label: "활성",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  INACTIVE: {
    label: "비활성",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
  PENDING: {
    label: "대기 중",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  ERROR: { label: "오류", color: "bg-red-100 text-red-800 border-red-200" },
} as const;

export const providerConfig = {
  NPM: { label: "NPM", color: "bg-red-100 text-red-800 border-red-200" },
  PYTHON: {
    label: "Python",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  GITHUB: {
    label: "GitHub",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  DOCKER: {
    label: "Docker",
    color: "bg-cyan-100 text-cyan-800 border-cyan-200",
  },
  CUSTOM: {
    label: "Custom",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
} as const;

export const categoryConfig = {
  WEB_SEARCH: { label: "웹 검색" },
  DATA_RETRIEVAL: { label: "데이터 조회" },
  API_CLIENT: { label: "API 클라이언트" },
  DOCUMENT_MANAGEMENT: { label: "문서 관리" },
  FILE_OPERATIONS: { label: "파일 작업" },
  CONTENT_PROCESSING: { label: "콘텐츠 처리" },
  DATA_ANALYSIS: { label: "데이터 분석" },
  DATABASE_TOOLS: { label: "데이터베이스 도구" },
  VISUALIZATION: { label: "시각화" },
  DEVELOPMENT_TOOLS: { label: "개발 도구" },
  SYSTEM_UTILITIES: { label: "시스템 유틸리티" },
  CODE_GENERATION: { label: "코드 생성" },
  COMMUNICATION: { label: "커뮤니케이션" },
  INTEGRATION: { label: "통합" },
  AUTOMATION: { label: "자동화" },
  SECURITY: { label: "보안" },
  AUTHENTICATION: { label: "인증" },
  PRODUCTIVITY: { label: "생산성" },
  ENTERTAINMENT: { label: "엔터테인먼트" },
  EDUCATION: { label: "교육" },
  OTHER: { label: "기타" },
} as const;

export const deploymentTypeConfig = {
  LOCAL: { label: "로컬", icon: Server },
  CONTAINER: { label: "컨테이너", icon: Container },
  CLOUD: { label: "클라우드", icon: Globe },
  SERVERLESS: { label: "서버리스", icon: Zap },
} as const;

// Select 옵션 배열 생성
export const PROVIDER_OPTIONS: {
  value: MCPToolProvider;
  label: string;
}[] = Object.entries(providerConfig).map(([value, config]) => ({
  value: value as MCPToolProvider,
  label: config.label,
}));

export const CATEGORY_OPTIONS: {
  value: MCPToolCategory;
  label: string;
}[] = Object.entries(categoryConfig).map(([value, config]) => ({
  value: value as MCPToolCategory,
  label: config.label,
}));

export const DEPLOYMENT_TYPE_OPTIONS: {
  value: MCPToolDeploymentType;
  label: string;
}[] = Object.entries(deploymentTypeConfig).map(([value, config]) => ({
  value: value as MCPToolDeploymentType,
  label: config.label,
}));
