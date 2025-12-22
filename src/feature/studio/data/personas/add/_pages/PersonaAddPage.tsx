"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePostPersona } from "../_hooks/usePostPersona";
import { useGetPersonas } from "@/feature/studio/templates/personas/_hooks/useGetPersonas";
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
  FileText,
  Tag,
  UserPlus,
  Info,
  Star,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { GetMyInfoResponse } from "@/shared/api/getMyInfo";

interface PersonaAddPageProps {
  myInfo: GetMyInfoResponse;
}

export function PersonaAddPage({ myInfo }: PersonaAddPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    persona_data_id: "",
    user_my_persona_title: "",
    user_my_persona_description: "",
    is_favorite: false,
  });

  // 페르소나 목록 조회 (공개된 페르소나만)
  const { data: personasData, isLoading: isLoadingPersonas } = useGetPersonas({
    is_public: true,
    page: 1,
    size: 100,
  });

  // 마이페이지에 페르소나 추가 mutation
  const { mutate: createPersona, isPending: isCreating } = usePostPersona({
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["personas"],
      });
      // 생성된 마이페이지 페르소나 상세 페이지로 이동
      router.push(`/studio/data/personas/${data.id}`);
    },
    meta: {
      successMessage: "페르소나가 마이페이지에 성공적으로 추가되었습니다.",
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!myInfo?.id) {
      toast.error("사용자 정보를 불러올 수 없습니다.");
      return;
    }

    if (!formData.persona_data_id) {
      toast.error("페르소나를 선택해주세요.");
      return;
    }

    createPersona({
      user_id: myInfo.id.toString(),
      persona_data_id: Number(formData.persona_data_id),
      user_my_persona_title: formData.user_my_persona_title || null,
      user_my_persona_description: formData.user_my_persona_description || null,
      is_favorite: formData.is_favorite,
    });
  };

  const selectedPersona = personasData?.items.find(
    (p) => p.id.toString() === formData.persona_data_id
  );

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
              onClick={() => router.push("/studio/data/personas")}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <UserPlus className="h-8 w-8" />
                마이페이지에 페르소나 추가
              </h1>
              <p className="text-muted-foreground mt-1">
                기존 페르소나를 마이페이지에 추가합니다
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" className="shrink-0" disabled={isCreating}>
              <Save className="h-4 w-4 mr-2" />
              {isCreating ? "추가 중..." : "페르소나 추가"}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* 페르소나 선택 Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                페르소나 선택
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 페르소나 선택 */}
                <div className="space-y-2">
                  <Label
                    htmlFor="persona_data_id"
                    className="flex items-center gap-2"
                  >
                    <Tag className="h-4 w-4" />
                    <span>페르소나 *</span>
                  </Label>
                  {isLoadingPersonas ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <Select
                      value={formData.persona_data_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, persona_data_id: value })
                      }
                      required
                    >
                      <SelectTrigger
                        id="persona_data_id"
                        className="pl-6 w-full"
                      >
                        <SelectValue placeholder="페르소나를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {personasData?.items.map((persona) => (
                          <SelectItem
                            key={persona.id}
                            value={persona.id.toString()}
                          >
                            <div className="flex flex-col items-start">
                              <span className="font-medium">
                                {persona.name || "이름 없음"}
                              </span>
                              {persona.description && (
                                <span className="text-xs text-muted-foreground text-left">
                                  {persona.description}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <p className="text-xs text-muted-foreground">
                    마이페이지에 추가할 페르소나를 선택하세요
                  </p>
                  {selectedPersona && (
                    <div className="mt-2 p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium">
                        {selectedPersona.name}
                      </p>
                      {selectedPersona.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {selectedPersona.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* 즐겨찾기 */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="is_favorite"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Star className="h-4 w-4" />
                      <span>즐겨찾기</span>
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      즐겨찾기로 설정하면 마이페이지 상단에 표시됩니다
                    </p>
                  </div>
                  <Switch
                    id="is_favorite"
                    checked={formData.is_favorite}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_favorite: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 개인 설정 Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                개인 설정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 개인 제목 */}
                <div className="space-y-2">
                  <Label
                    htmlFor="user_my_persona_title"
                    className="flex items-center gap-2"
                  >
                    <Tag className="h-4 w-4" />
                    <span>개인 제목 (선택사항)</span>
                  </Label>
                  <Input
                    id="user_my_persona_title"
                    value={formData.user_my_persona_title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        user_my_persona_title: e.target.value,
                      })
                    }
                    placeholder="예: 내 Python 개발 도우미"
                    className="pl-6"
                  />
                  <p className="text-xs text-muted-foreground">
                    마이페이지에서 사용할 개인적인 별칭입니다. 입력하지 않으면
                    원본 이름이 사용됩니다.
                  </p>
                </div>

                {/* 개인 설명 */}
                <div className="space-y-2">
                  <Label
                    htmlFor="user_my_persona_description"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>개인 메모 (선택사항)</span>
                  </Label>
                  <Textarea
                    id="user_my_persona_description"
                    value={formData.user_my_persona_description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        user_my_persona_description: e.target.value,
                      })
                    }
                    placeholder="이 페르소나를 어떻게 사용할지 메모하세요"
                    className="pl-6 field-sizing-content"
                  />
                  <p className="text-xs text-muted-foreground">
                    개인적인 사용 목적이나 메모를 작성할 수 있습니다.
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
              * 표시된 필드는 필수 입력 항목입니다. 페르소나 추가 후 개인 설정은
              페르소나 상세 페이지에서 수정할 수 있습니다.
            </span>
          </AlertDescription>
        </Alert>
      </div>
    </form>
  );
}

export default PersonaAddPage;
