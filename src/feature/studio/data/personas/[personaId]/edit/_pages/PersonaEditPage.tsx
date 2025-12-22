"use client";

import { useState, FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePutMyPersona } from "../_hooks/usePutMyPersona";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  Lock,
  Unlock,
  ArrowLeft,
  Save,
  UserCircle,
  FileText,
  Tag,
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

interface PersonaEditPageProps {
  myPersona: GetMyPersonaResponse;
}

function PersonaEditPage({ myPersona }: PersonaEditPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: myPersona.user_my_persona_title || "",
    description: myPersona.user_my_persona_description || "",
    category: "GENERAL" as PersonaCategoryEnum,
    is_public: true,
  });

  const { mutate: updatePersona, isPending: isUpdating } = usePutMyPersona({
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
        my_page_id: myPersona.id,
      },
      data: {
        user_id: myPersona.user_id,
        persona_data_id: myPersona.persona_data_id,
        user_my_persona_title: formData.name || null,
        user_my_persona_description: formData.description || null,
        is_favorite: myPersona.is_favorite ?? false,
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
        </div>
      </div>
    </form>
  );
}

export default PersonaEditPage;
