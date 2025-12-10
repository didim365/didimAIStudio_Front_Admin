"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { ArrowLeft, Save, X, Workflow, Shield, User } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import Link from "next/link";
import { categoryConfig } from "../../../_constants/categoryConfig";
import type { GetScenarioResponse } from "../../_api/getScenario";
import usePutScenario from "../_hooks/usePutScenario";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

interface ScenarioEditPageProps {
  scenario: GetScenarioResponse;
}

function ScenarioEditPage({ scenario }: ScenarioEditPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const basePath = pathname?.startsWith("/studio/data") ? "/studio/data" : "/studio/templates";
  const queryClient = useQueryClient();
  const { mutate: putScenario, isPending } = usePutScenario({
    meta: {
      successMessage: "시나리오가 성공적으로 수정되었습니다.",
    },
  });

  const [formData, setFormData] = useState({
    name: scenario.name,
    description: scenario.description,
    is_system: scenario.is_system,
  });

  const categoryInfo = categoryConfig[scenario.category] || {
    label: scenario.category,
    color: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    putScenario(
      {
        scenario_id: scenario.id,
        category: scenario.category,
        definition_name: scenario.definition_name,
        description: formData.description,
        is_public: true,
        is_system: formData.is_system,
        name: formData.name,
        user_id: scenario.user_id,
        user_scenario_description: scenario.description,
        user_scenario_title: scenario.name,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["scenarios"] });
          router.push(`${basePath}/scenarios/${scenario.id}`);
        },
      }
    );
  };

  const handleCancel = () => {
    router.push(`${basePath}/scenarios/${scenario.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`${basePath}/scenarios/${scenario.id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">시나리오 수정</h1>
            <p className="text-muted-foreground">시나리오 ID: {scenario.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={handleCancel}
            disabled={isPending}
          >
            <X className="h-4 w-4 mr-2" />
            취소
          </Button>
          <Button
            className="cursor-pointer"
            onClick={handleSubmit}
            disabled={isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {isPending ? "저장 중..." : "수정하기"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5" />
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Icon and Category */}
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 border-4 border-background shadow-lg rounded-2xl from-primary/20 to-primary/5 flex items-center justify-center">
                  <Workflow className="h-12 w-12 text-primary" />
                </div>
                <div className="flex-1">
                  <Badge className={`${categoryInfo.color} border`}>
                    {categoryInfo.label}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    카테고리: {categoryInfo.label}
                  </p>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">이름 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="시나리오 이름을 입력하세요"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">설명 *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="시나리오 설명을 입력하세요"
                  rows={4}
                  required
                />
              </div>

              {/* Definition Name (Read-only) */}
              <div className="space-y-2">
                <Label>정의 이름</Label>
                <div className="p-3 bg-muted rounded-lg border border-border">
                  <p className="text-sm">{scenario.definition_name}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  정의 이름은 수정할 수 없습니다.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                추가 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="is_system">타입 *</Label>
                <Select
                  value={formData.is_system.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, is_system: value === "true" })
                  }
                >
                  <SelectTrigger id="is_system">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-purple-600" />
                        <span>템플릿</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="false">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-green-600" />
                        <span>사용자</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  템플릿: 시스템에서 제공하는 기본 시나리오 / 사용자: 직접
                  생성한 시나리오
                </p>
              </div>

              {/* User ID (Read-only) */}
              <div className="space-y-2">
                <Label>사용자 ID</Label>
                <div className="p-3 bg-muted rounded-lg border border-border">
                  <p className="text-sm">{scenario.user_id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}

export default ScenarioEditPage;
