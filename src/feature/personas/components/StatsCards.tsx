"use client";

import { Card, CardContent } from "@/shared/ui/card";
import { Users, Shield, Lock, Unlock, Briefcase } from "lucide-react";

interface StatsCardsProps {
  total: number;
  system: number;
  user: number;
  public: number;
  private: number;
}

export function StatsCards({ total, system, user, public: publicCount, private: privateCount }: StatsCardsProps) {
  const stats = [
    {
      label: "전체 페르소나",
      value: total,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "시스템 제공",
      value: system,
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      label: "사용자 생성",
      value: user,
      icon: Briefcase,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "공개",
      value: publicCount,
      icon: Unlock,
      color: "text-teal-600",
      bgColor: "bg-teal-100",
    },
    {
      label: "비공개",
      value: privateCount,
      icon: Lock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="transition-all hover:shadow-md">
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
