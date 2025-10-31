"use client";

import { MetricCard } from "@/shared/components/dashboard/MetricCard";
import { useDashboard } from "../hooks/useDashboard";
import {
  userGrowthData,
  usageData,
  roleDistributionData,
  costData,
} from "../utils/mockData";
import { UserGrowthChart } from "../components/UserGrowthChart";
import { RoleDistributionChart } from "../components/RoleDistributionChart";
import { TokenUsageChart } from "../components/TokenUsageChart";
import { CostBreakdownChart } from "../components/CostBreakdownChart";

export default function DashboardPage() {
  const { themeKey, isDarkMode, metricCards } = useDashboard();

  return (
    <div className="flex-1 space-y-4 pt-6" key={themeKey}>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">대시보드</h2>
          <p className="text-muted-foreground">
            시스템 전반의 사용 현황과 통계를 확인하세요
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card, index) => (
          <MetricCard
            key={index}
            title={card.title}
            value={card.value}
            description={card.description}
            icon={card.icon}
            trend={card.trend}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <UserGrowthChart data={userGrowthData} isDarkMode={isDarkMode} />
        <RoleDistributionChart
          data={roleDistributionData}
          isDarkMode={isDarkMode}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <TokenUsageChart data={usageData} isDarkMode={isDarkMode} />
        <CostBreakdownChart data={costData} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}
