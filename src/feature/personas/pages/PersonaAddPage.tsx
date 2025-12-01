"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePostPersona } from "../hooks/usePostPersona";
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
import { Switch } from "@/shared/ui/switch";
import {
  User,
  ArrowLeft,
  Save,
  Sparkles,
  FileText,
  Tag,
  Globe,
  UserPlus,
  Info,
} from "lucide-react";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { categoryConfig, CATEGORY_OPTIONS } from "../constants/categoryConfig";
import { paths } from "@/shared/types/api/agents";
import { GetMyInfoResponse } from "@/shared/api/getMyInfo";

type PersonaCategoryEnum =
  paths["/v1/personas/data"]["post"]["requestBody"]["content"]["application/json"]["category"];

interface PersonaAddPageProps {
  myInfo: GetMyInfoResponse;
}

export function PersonaAddPage({ myInfo }: PersonaAddPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    system_prompt: "",
    category: "CUSTOM" as PersonaCategoryEnum,
    is_public: false,
    is_system: true,
  });

  // 페르소나 생성 mutation
  const { mutate: createPersona, isPending: isCreating } = usePostPersona({
    onSuccess: (data) => {
      toast.success("페르소나가 성공적으로 생성되었습니다.");
      queryClient.invalidateQueries({
        queryKey: ["personas"],
      });
      // 생성된 페르소나 상세 페이지로 이동
      router.push(`/studio/personas/${data.id}`);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!myInfo?.id) {
      toast.error("사용자 정보를 불러올 수 없습니다.");
      return;
    }

    createPersona({
      user_id: myInfo.id.toString(),
      name: formData.name,
      description: formData.description,
      system_prompt: formData.system_prompt,
      category: formData.category,
      is_public: formData.is_public,
      is_system: formData.is_system,
    });
  };

  const selectedCategory = categoryConfig[formData.category] || {
    label: formData.category,
    color: "bg-neutral-100 text-neutral-800 border-neutral-200",
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => router.push("/studio/personas")}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <UserPlus className="h-8 w-8" />새 페르소나 추가
              </h1>
              <p className="text-muted-foreground mt-1">
                새로운 AI 페르소나를 생성합니다
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" className="shrink-0" disabled={isCreating}>
              <Save className="h-4 w-4 mr-2" />
              {isCreating ? "생성 중..." : "페르소나 생성"}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* 기본 정보 Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {/* 공개 여부 */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="is_public"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Globe className="h-4 w-4" />
                      <span>공개 페르소나</span>
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      다른 사용자에게 공개할지 여부를 설정합니다
                    </p>
                  </div>
                  <Switch
                    id="is_public"
                    checked={formData.is_public}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_public: checked })
                    }
                  />
                </div>
                {/* 페르소나 이름 */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span>페르소나 이름 *</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="예: Python 개발 전문가"
                    className="pl-6"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    다른 사용자에게 표시될 공식 페르소나 이름입니다
                  </p>
                </div>

                {/* 카테고리 */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span>카테고리 *</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: PersonaCategoryEnum) =>
                      setFormData({ ...formData, category: value })
                    }
                    required
                  >
                    <SelectTrigger id="category" className="pl-6 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((category) => {
                        const config = categoryConfig[category];
                        return (
                          <SelectItem key={category} value={category}>
                            {config.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {formData.category && (
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${selectedCategory.color}`}
                      >
                        {selectedCategory.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* 설명 */}
                <div className="space-y-2">
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    placeholder="페르소나의 목적과 전문성을 설명하세요"
                    className="pl-6 field-sizing-content"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    페르소나의 목적과 전문성을 설명하는 공식 정보입니다
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 시스템 프롬프트 Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                시스템 프롬프트
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="system_prompt"
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>시스템 프롬프트 *</span>
                  </Label>
                  <Textarea
                    id="system_prompt"
                    value={formData.system_prompt}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        system_prompt: e.target.value,
                      })
                    }
                    placeholder="예: <ROLE>당신은 10년 경력의 Python 개발 전문가입니다.</ROLE><INSTRUCTIONS>사용자의 Python 코드를 분석하고 개선 사항을 제안하세요. 명확하고 실용적인 조언을 제공하세요.</INSTRUCTIONS>"
                    className="pl-6 font-mono text-sm field-sizing-content"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    AI 모델에 전달될 페르소나의 핵심 정의입니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Alert */}
        <Alert>
          <AlertDescription className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span className="text-sm">
              * 표시된 필드는 필수 입력 항목입니다. 페르소나 생성 후 추가 정보는
              페르소나 상세 페이지에서 수정할 수 있습니다.
            </span>
          </AlertDescription>
        </Alert>
      </div>
    </form>
  );
}

export default PersonaAddPage;
