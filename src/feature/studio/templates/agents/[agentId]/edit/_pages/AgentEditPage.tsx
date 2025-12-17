"use client";

import { useState, FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePutAgent } from "../_hooks/usePutAgent";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import {
  Bot,
  ArrowLeft,
  Save,
  Settings,
  Tag,
  FileText,
  Sparkles,
  Cpu,
  Wrench,
  Globe,
  Lock,
  UserCircle,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useRouter } from "next/navigation";
import { paths } from "@/shared/types/api/agents";
import Link from "next/link";
import { toast } from "sonner";
import {
  CATEGORY_LABELS,
  CATEGORY_OPTIONS,
} from "../../../_constants/agentCategoryConstants";
import { GetSettingsResponse } from "@/feature/studio/data/models/_api/getSettings";

type GetAgentResponse =
  paths["/v1/agents/data/{agent_id}"]["get"]["responses"]["200"]["content"]["application/json"];

export function AgentEditPage({
  agent,
  settings,
}: {
  agent: GetAgentResponse;
  settings: GetSettingsResponse;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Ensure settings is an array
  const settingsList = Array.isArray(settings) ? settings : [];

  const [formData, setFormData] = useState<{
    name: string;
    category: string;
    description: string;
    is_public: boolean;
    model_my_page_id: string;
    fallback_model_my_page_id: string;
    persona_my_page_id: string;
    tool_my_page_id: string;
  }>({
    name: agent.name || "",
    category: agent.category || "",
    description: agent.description || "",
    is_public: agent.is_public ?? false,
    model_my_page_id: agent.model_my_page_id?.toString() || "",
    fallback_model_my_page_id:
      agent.fallback_model_my_page_id?.toString() || "",
    persona_my_page_id: agent.persona_my_page_id?.toString() || "",
    tool_my_page_id: agent.tool_my_page_id?.join(", ") || "",
  });

  const { mutate: updateAgent, isPending: isUpdating } = usePutAgent({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["agents"],
      });
      queryClient.invalidateQueries({
        queryKey: ["agent", agent.id],
      });

      router.push(`/studio/templates/agents/${agent.id}`);
    },
    meta: {
      successMessage: "에이전트가 성공적으로 수정되었습니다.",
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Helper function to safely convert string to number or null
    const toNumberOrNull = (value: string): number | null => {
      if (!value || value.trim() === "") return null;
      const num = Number(value);
      return isNaN(num) ? null : num;
    };

    // Tool IDs 파싱
    const toolIds: number[] = formData.tool_my_page_id
      .split(",")
      .map((id: string) => id.trim())
      .filter((id: string) => id !== "")
      .map((id: string) => Number(id))
      .filter((id: number) => !isNaN(id));

    // Required fields validation
    const modelId = toNumberOrNull(formData.model_my_page_id);
    const fallbackModelId = toNumberOrNull(formData.fallback_model_my_page_id);

    if (!modelId) {
      toast.error("모델 ID는 필수입니다.");
      return;
    }

    if (!fallbackModelId) {
      toast.error("폴백 모델 ID는 필수입니다.");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("에이전트 이름은 필수입니다.");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("에이전트 설명은 필수입니다.");
      return;
    }

    if (!formData.category) {
      toast.error("카테고리는 필수입니다.");
      return;
    }

    updateAgent({
      params: { agent_id: agent.id },
      data: {
        user_id: agent.user_id,
        model_my_page_id: modelId,
        fallback_model_my_page_id: fallbackModelId,
        category: formData.category as
          | "CHATBOT"
          | "REACT"
          | "MULTI_AGENT_SYSTEM"
          | "REFLECTION_CRITIQUE"
          | "PLANNING_AGENT"
          | "DATABASE"
          | "EVALUATION"
          | "EXPERIMENTAL",
        name: formData.name.trim(),
        description: formData.description.trim(),
        is_system: agent.is_system,
        is_public: formData.is_public,
        persona_my_page_id: toNumberOrNull(formData.persona_my_page_id),
        tool_my_page_id: toolIds.length > 0 ? toolIds : null,
      },
    });
  };

  const categoryLabel =
    CATEGORY_LABELS[formData.category] || formData.category || "미지정";

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={`/studio/templates/agents/${agent.id}`}>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                에이전트 정보 수정
              </h1>
              <p className="text-muted-foreground">에이전트 ID: {agent.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" className="shrink-0" disabled={isUpdating}>
              <Save className="h-4 w-4 mr-2" />
              {isUpdating ? "저장 중..." : "저장"}
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span>에이전트 이름 *</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="에이전트 이름을 입력하세요"
                    className="pl-6"
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span>카테고리 *</span>
                  </Label>
                  <Select
                    value={formData.category || undefined}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, category: value })
                    }
                    required
                  >
                    <SelectTrigger id="category" className="pl-6">
                      <SelectValue placeholder="카테고리를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.category && (
                    <div className="pl-6">
                      <Badge variant="secondary" className="text-sm">
                        {categoryLabel}
                      </Badge>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Description */}
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>공식 설명 *</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="에이전트의 공식 설명을 입력하세요"
                    className="min-h-[120px]"
                    rows={5}
                    required
                  />
                </div>

                <Separator />

                {/* Public Status */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    {formData.is_public ? (
                      <Globe className="h-4 w-4" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                    <span>공개 설정</span>
                  </Label>
                  <Select
                    value={formData.is_public ? "public" : "private"}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        is_public: value === "public",
                      })
                    }
                  >
                    <SelectTrigger className="pl-6">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          공개
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          비공개
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* System Agent Badge (Read-only) */}
                {agent.is_system && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border border-border">
                      <UserCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        시스템 에이전트 (읽기 전용)
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Configuration Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                설정 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Model My Page ID */}
                <div className="space-y-2">
                  <Label
                    htmlFor="model_my_page_id"
                    className="flex items-center gap-2"
                  >
                    <Cpu className="h-4 w-4" />
                    <span>모델 ID *</span>
                  </Label>
                  <Select
                    value={formData.model_my_page_id}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        model_my_page_id: value,
                      })
                    }
                    required
                  >
                    <SelectTrigger
                      id="model_my_page_id"
                      className="pl-6 w-full"
                    >
                      <SelectValue placeholder="모델을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {settingsList.map((setting) => (
                        <SelectItem
                          key={`main-model-id: ${setting.user_model_id}`}
                          value={String(setting.user_model_id)}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium">
                              {setting.model_name || "이름 없음"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ID: {setting.user_model_id}
                              {setting.deployment_type &&
                                ` • ${setting.deployment_type}`}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    agt_model_my_page 테이블의 모델 ID
                  </p>
                </div>

                {/* Fallback Model My Page ID */}
                <div className="space-y-2">
                  <Label
                    htmlFor="fallback_model_my_page_id"
                    className="flex items-center gap-2"
                  >
                    <Cpu className="h-4 w-4" />
                    <span>폴백 모델 ID *</span>
                  </Label>
                  <Select
                    value={formData.fallback_model_my_page_id}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        fallback_model_my_page_id: value,
                      })
                    }
                    required
                  >
                    <SelectTrigger
                      id="fallback_model_my_page_id"
                      className="pl-6 w-full"
                    >
                      <SelectValue placeholder="폴백 모델을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {settingsList.map((setting) => (
                        <SelectItem
                          key={`fallback-model-id: ${setting.user_model_id}`}
                          value={String(setting.user_model_id)}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium">
                              {setting.model_name || "이름 없음"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ID: {setting.user_model_id}
                              {setting.deployment_type &&
                                ` • ${setting.deployment_type}`}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    폴백 모델 ID (my page 모델 테이블)
                  </p>
                </div>

                {/* Persona My Page ID */}
                <div className="space-y-2">
                  <Label
                    htmlFor="persona_my_page_id"
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>페르소나 ID</span>
                  </Label>
                  <Input
                    id="persona_my_page_id"
                    type="number"
                    value={formData.persona_my_page_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        persona_my_page_id: e.target.value,
                      })
                    }
                    placeholder="페르소나 ID를 입력하세요"
                    className="pl-6"
                  />
                </div>

                {/* Tool My Page IDs */}
                <div className="space-y-2 md:col-span-2">
                  <Label
                    htmlFor="tool_my_page_id"
                    className="flex items-center gap-2"
                  >
                    <Wrench className="h-4 w-4" />
                    <span>도구 ID 목록</span>
                  </Label>
                  <Input
                    id="tool_my_page_id"
                    value={formData.tool_my_page_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tool_my_page_id: e.target.value,
                      })
                    }
                    placeholder="쉼표로 구분하여 입력하세요 (예: 1, 2, 3)"
                    className="pl-6"
                  />
                  <p className="text-xs text-muted-foreground pl-6">
                    여러 도구 ID를 쉼표로 구분하여 입력하세요
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}

export default AgentEditPage;
