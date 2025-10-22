import { UserGrowthData, UsageData, RoleDistribution, CostData } from "../types";

export const userGrowthData: UserGrowthData[] = [
  { month: "1월", users: 400 },
  { month: "2월", users: 450 },
  { month: "3월", users: 520 },
  { month: "4월", users: 580 },
  { month: "5월", users: 650 },
  { month: "6월", users: 720 },
  { month: "7월", users: 780 },
  { month: "8월", users: 850 },
  { month: "9월", users: 920 },
  { month: "10월", users: 1050 },
  { month: "11월", users: 1180 },
  { month: "12월", users: 1320 },
];

export const usageData: UsageData[] = [
  { date: "1일", chatTokens: 45000, embeddingTokens: 12000 },
  { date: "2일", chatTokens: 52000, embeddingTokens: 15000 },
  { date: "3일", chatTokens: 48000, embeddingTokens: 13000 },
  { date: "4일", chatTokens: 61000, embeddingTokens: 18000 },
  { date: "5일", chatTokens: 55000, embeddingTokens: 16000 },
  { date: "6일", chatTokens: 67000, embeddingTokens: 20000 },
  { date: "7일", chatTokens: 59000, embeddingTokens: 17000 },
];

export const roleDistributionData: RoleDistribution[] = [
  { name: "일반 사용자", value: 450, color: "#0f172a" },
  { name: "프리미엄", value: 180, color: "#475569" },
  { name: "관리자", value: 25, color: "#94a3b8" },
];

export const costData: CostData[] = [
  { service: "ChatGPT-4", cost: 1250000 },
  { service: "Claude", cost: 850000 },
  { service: "임베딩", cost: 450000 },
  { service: "기타", cost: 180000 },
];
