export interface UserGrowthData {
  month: string;
  users: number;
}

export interface UsageData {
  date: string;
  chatTokens: number;
  embeddingTokens: number;
}

export interface RoleDistribution {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

export interface CostData {
  service: string;
  cost: number;
}

export interface MetricCardData {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
}
