"use client";

import { useState, FormEvent } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePostAgent } from "../hooks/usePostAgent";
import { useGetMyInfo } from "@/shared/hooks/useGetMyInfo";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
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
import {
  Bot,
  ArrowLeft,
  Save,
  Settings,
  FileText,
  Sparkles,
  Cpu,
  User,
  Wrench,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { categoryConfig, CATEGORY_OPTIONS } from "../constants/categoryConfig";
import { cn } from "@/shared/lib/utils";

export function AgentAddPage() {
  const router = useRouter();
  const pathname = usePathname();
  const basePath = pathname?.startsWith("/studio/data") ? "/studio/data" : "/studio/templates";
  const queryClient = useQueryClient();
  const { data: myInfo } = useGetMyInfo();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "CHATBOT" as (typeof CATEGORY_OPTIONS)[number],
    model_my_page_id: "",
    fallback_model_my_page_id: "",
    persona_my_page_id: "",
    tool_my_page_id: "",
    user_agent_description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 에이전트 생성 mutation
  const { mutate: createAgent, isPending: isCreating } = usePostAgent({
    onSuccess: (data) => {
      toast.success("에이전트가 성공적으로 생성되었습니다.");
      queryClient.invalidateQueries({
        queryKey: ["agents"],
      });
      // 생성된 에이전트 상세 페이지로 이동
      router.push(`${basePath}/agents/${data.id}`);
    },
    onError: (error: Error) => {
      toast.error(`에이전트 생성 실패: ${error.message}`);
    },
  });

  // 폼 검증
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "에이전트 이름을 입력하세요.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "에이전트 설명을 입력하세요.";
    }

    if (!formData.model_my_page_id) {
      newErrors.model_my_page_id = "모델 ID를 입력하세요.";
    } else if (isNaN(Number(formData.model_my_page_id))) {
      newErrors.model_my_page_id = "유효한 숫자를 입력하세요.";
    }

    if (!formData.fallback_model_my_page_id) {
      newErrors.fallback_model_my_page_id = "폴백 모델 ID를 입력하세요.";
    } else if (isNaN(Number(formData.fallback_model_my_page_id))) {
      newErrors.fallback_model_my_page_id = "유효한 숫자를 입력하세요.";
    }

    if (
      formData.persona_my_page_id &&
      isNaN(Number(formData.persona_my_page_id))
    ) {
      newErrors.persona_my_page_id = "유효한 숫자를 입력하세요.";
    }

    if (formData.tool_my_page_id) {
      const toolIds = formData.tool_my_page_id
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id.length > 0);
      if (toolIds.some((id) => isNaN(Number(id)))) {
        newErrors.tool_my_page_id =
          "유효한 숫자들을 쉼표로 구분하여 입력하세요.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!myInfo?.id) {
      toast.error("사용자 정보를 불러올 수 없습니다.");
      return;
    }

    // Tool IDs 파싱
    const toolIds = formData.tool_my_page_id
      ? formData.tool_my_page_id
          .split(",")
          .map((id) => Number(id.trim()))
          .filter((id) => !isNaN(id))
      : null;

    createAgent({
      user_id: myInfo.id,
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category as
        | "CHATBOT"
        | "REACT"
        | "MULTI_AGENT_SYSTEM"
        | "REFLECTION_CRITIQUE"
        | "PLANNING_AGENT"
        | "DATABASE"
        | "EVALUATION"
        | "EXPERIMENTAL",
      model_my_page_id: Number(formData.model_my_page_id),
      fallback_model_my_page_id: Number(formData.fallback_model_my_page_id),
      persona_my_page_id: formData.persona_my_page_id
        ? Number(formData.persona_my_page_id)
        : null,
      tool_my_page_id: toolIds && toolIds.length > 0 ? toolIds : null,
      user_agent_description: formData.user_agent_description.trim() || null,
      is_system: true,
      is_public: true,
    });
  };

  const selectedCategory = categoryConfig[formData.category];

  return (
    <div className="py-8 px-4">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={`${basePath}/agents`}>
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
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                  <Bot className="h-8 w-8" />새 에이전트 추가
                </h1>
                <p className="text-muted-foreground mt-1">
                  새로운 AI 에이전트를 생성합니다
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button type="submit" className="shrink-0" disabled={isCreating}>
                <Save className="h-4 w-4 mr-2" />
                {isCreating ? "생성 중..." : "에이전트 생성"}
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* 기본 정보 Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  기본 정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* 카테고리 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="category"
                      className="flex items-center gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>카테고리 *</span>
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: string) =>
                        setFormData({
                          ...formData,
                          category: value as (typeof CATEGORY_OPTIONS)[number],
                        })
                      }
                      required
                    >
                      <SelectTrigger id="category" className="pl-6 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((category) => (
                          <SelectItem key={category} value={category}>
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "px-2 py-1 rounded text-xs",
                                  categoryConfig[category]?.color
                                )}
                              >
                                {categoryConfig[category]?.label || category}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 에이전트 이름 */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>에이전트 이름 *</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: "" });
                      }}
                      placeholder="AI 챗봇 에이전트"
                      className="pl-6"
                      required
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* 설명 */}
                  <div className="space-y-2 md:col-span-2">
                    <Label
                      htmlFor="description"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      <span>설명 *</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        });
                        if (errors.description)
                          setErrors({ ...errors, description: "" });
                      }}
                      placeholder="에이전트의 기능과 목적을 설명하세요"
                      className="pl-6 min-h-[100px]"
                      required
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 모델 설정 Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  모델 설정
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 모델 ID */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="model_my_page_id"
                      className="flex items-center gap-2"
                    >
                      <Cpu className="h-4 w-4" />
                      <span>모델 ID *</span>
                    </Label>
                    <Input
                      id="model_my_page_id"
                      type="number"
                      value={formData.model_my_page_id}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          model_my_page_id: e.target.value,
                        });
                        if (errors.model_my_page_id)
                          setErrors({ ...errors, model_my_page_id: "" });
                      }}
                      placeholder="1"
                      className="pl-6"
                      required
                    />
                    {errors.model_my_page_id && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.model_my_page_id}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      agt_model_my_page 테이블의 모델 ID
                    </p>
                  </div>

                  {/* 폴백 모델 ID */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="fallback_model_my_page_id"
                      className="flex items-center gap-2"
                    >
                      <Cpu className="h-4 w-4" />
                      <span>폴백 모델 ID *</span>
                    </Label>
                    <Input
                      id="fallback_model_my_page_id"
                      type="number"
                      value={formData.fallback_model_my_page_id}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          fallback_model_my_page_id: e.target.value,
                        });
                        if (errors.fallback_model_my_page_id)
                          setErrors({
                            ...errors,
                            fallback_model_my_page_id: "",
                          });
                      }}
                      placeholder="2"
                      className="pl-6"
                      required
                    />
                    {errors.fallback_model_my_page_id && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.fallback_model_my_page_id}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      폴백 모델 ID (my page 모델 테이블)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 추가 설정 Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  추가 설정
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 페르소나 ID */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="persona_my_page_id"
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      <span>페르소나 ID</span>
                    </Label>
                    <Input
                      id="persona_my_page_id"
                      type="number"
                      value={formData.persona_my_page_id}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          persona_my_page_id: e.target.value,
                        });
                        if (errors.persona_my_page_id)
                          setErrors({ ...errors, persona_my_page_id: "" });
                      }}
                      placeholder="2"
                      className="pl-6"
                    />
                    {errors.persona_my_page_id && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.persona_my_page_id}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      agt_persona_my_page 테이블의 페르소나 ID (선택사항)
                    </p>
                  </div>

                  {/* 도구 ID */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="tool_my_page_id"
                      className="flex items-center gap-2"
                    >
                      <Wrench className="h-4 w-4" />
                      <span>도구 ID</span>
                    </Label>
                    <Input
                      id="tool_my_page_id"
                      value={formData.tool_my_page_id}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          tool_my_page_id: e.target.value,
                        });
                        if (errors.tool_my_page_id)
                          setErrors({ ...errors, tool_my_page_id: "" });
                      }}
                      placeholder="3, 4, 5"
                      className="pl-6"
                    />
                    {errors.tool_my_page_id && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.tool_my_page_id}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      쉼표로 구분된 도구 ID 목록 (예: 3, 4, 5)
                    </p>
                  </div>

                  {/* 사용자 정의 설명 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="user_agent_description"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      <span>사용자 정의 설명</span>
                    </Label>
                    <Textarea
                      id="user_agent_description"
                      value={formData.user_agent_description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          user_agent_description: e.target.value,
                        })
                      }
                      placeholder="사용자가 정의하는 에이전트 설명"
                      className="pl-6 min-h-[80px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      사용자가 정의하는 에이전트 설명 (선택사항)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Alert */}
          <Alert>
            <AlertDescription className="flex items-center gap-2">
              <span className="text-sm">
                * 표시된 필드는 필수 입력 항목입니다. 에이전트 생성 후 추가
                정보는 에이전트 상세 페이지에서 수정할 수 있습니다.
              </span>
            </AlertDescription>
          </Alert>
        </div>
      </form>
    </div>
  );
}

export default AgentAddPage;
