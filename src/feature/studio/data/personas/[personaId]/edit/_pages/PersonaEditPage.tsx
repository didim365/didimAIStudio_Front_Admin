"use client";

import { useState, FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePutPersona } from "../_hooks/usePutPersona";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  Lock,
  Unlock,
  ArrowLeft,
  Save,
  UserCircle,
  FileText,
  Tag,
  Sparkles,
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
import { Switch } from "@/shared/ui/switch";
import { useRouter } from "next/navigation";
import {
  categoryConfig,
  CATEGORY_OPTIONS,
  PersonaCategoryEnum,
} from "../../../_constants/categoryConfig";
import { GetMyPersonaResponse } from "../../_api/getMyPersona";
import { GetPersonaResponse } from "@/feature/studio/templates/personas/[personaId]/_api/getPersona";

interface PersonaEditPageProps {
  myPersona: GetMyPersonaResponse;
  persona: GetPersonaResponse;
}

function PersonaEditPage({ myPersona, persona }: PersonaEditPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: persona.name,
    description: persona.description,
    category: persona.category,
    is_public: persona.is_public ?? true,
    system_prompt: persona.system_prompt,
  });

  const { mutate: updatePersona, isPending: isUpdating } = usePutPersona({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["personas"],
      });
      queryClient.invalidateQueries({
        queryKey: ["persona", myPersona.id],
      });

      router.push(`/studio/data/personas/${myPersona.id}`);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updatePersona({
      params: {
        persona_id: persona.id,
      },
      data: {
        user_id: persona.user_id,
        name: formData.name,
        description: formData.description,
        system_prompt: formData.system_prompt,
        is_system: persona.is_system,
        category: formData.category,
        is_public: formData.is_public,
      },
    });
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
              onClick={() =>
                router.push(`/studio/data/personas/${myPersona.id}`)
              }
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                페르소나 정보 수정
              </h1>
              <p className="text-muted-foreground">
                페르소나 ID: {myPersona.id}
              </p>
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
          {/* Profile Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                페르소나 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Persona Info Grid */}
                <div className="flex-1 space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>제목 *</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                      placeholder="페르소나 제목을 입력하세요"
                      className="pl-6"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="user_persona_description"
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
                      placeholder="페르소나 설명을 입력하세요"
                      className="pl-6 field-sizing-content"
                      rows={5}
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="category"
                      className="flex items-center gap-2"
                    >
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
                        {CATEGORY_OPTIONS.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {categoryConfig[cat].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Public Status */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="is_public"
                      className="flex items-center gap-2"
                    >
                      {formData.is_public && <Unlock className="h-4 w-4" />}{" "}
                      {!formData.is_public && <Lock className="h-4 w-4" />}
                      <span>공개 설정 *</span>
                    </Label>
                    <div className="pl-6 flex items-center gap-3">
                      <Switch
                        id="is_public"
                        checked={formData.is_public}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, is_public: checked })
                        }
                      />
                      <span className="text-sm text-muted-foreground">
                        {formData.is_public ? "공개" : "비공개"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Prompt Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                시스템 프롬프트
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label
                  htmlFor="system_prompt"
                  className="flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>AI 모델에 전달되는 프롬프트 *</span>
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
                  placeholder="시스템 프롬프트를 입력하세요"
                  className="pl-6 font-mono text-sm field-sizing-content"
                  rows={10}
                  required
                />
                <p className="text-xs text-muted-foreground pl-6">
                  이 프롬프트는 AI 모델의 동작을 정의하는 핵심 설정입니다.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}

export default PersonaEditPage;
