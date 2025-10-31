"use client";

import { Card, CardContent } from "@/shared/ui/card";
import { Box, Server, Cloud, Filter } from "lucide-react";

interface ModelStatsCardsProps {
  total: number;
  privateVllm: number;
  publicApi: number;
  filtered: number;
}

export function ModelStatsCards({
  total,
  privateVllm,
  publicApi,
  filtered,
}: ModelStatsCardsProps) {
  const stats = [
    {
      label: "전체 모델",
      value: total,
      icon: Box,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Private vLLM",
      value: privateVllm,
      icon: Server,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      label: "Public API",
      value: publicApi,
      icon: Cloud,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "필터링된 결과",
      value: filtered,
      icon: Filter,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
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
