"use client";

import { Card, CardContent } from "@/shared/ui/card";
import { Box, Activity, AlertCircle, Clock } from "lucide-react";

interface StatsCardsProps {
  total: number;
  active: number;
  pending: number;
  error: number;
}

export function StatsCards({ total, active, pending, error }: StatsCardsProps) {
  const stats = [
    {
      label: "전체 도구",
      value: total,
      icon: Box,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "활성 도구",
      value: active,
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "대기 중",
      value: pending,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      label: "오류",
      value: error,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
