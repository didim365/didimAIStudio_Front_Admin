"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePostCatalog } from "../_hooks/usePostCatalog";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import {
  Bot,
  Building2,
  Tag,
  FileText,
  Link2,
  Hash,
  Coins,
  Database,
  ArrowLeft,
  Save,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";

type AICategoryEnum =
  | "TEXT"
  | "IMAGE"
  | "MULTIMODAL"
  | "EMBEDDING"
  | "AUDIO"
  | "VIDEO"
  | "CHAT"
  | "COMPLETION"
  | "IMAGE_GENERATION"
  | "AUDIO_TRANSCRIPTION"
  | "AUDIO_SPEECH";

type ModelStatusEnum = "ALPHA" | "BETA" | "STABLE" | "DEPRECATED";

const CATEGORY_OPTIONS: { value: AICategoryEnum; label: string }[] = [
  { value: "TEXT", label: "텍스트" },
  { value: "IMAGE", label: "이미지" },
  { value: "MULTIMODAL", label: "멀티모달" },
  { value: "EMBEDDING", label: "임베딩" },
  { value: "AUDIO", label: "오디오" },
  { value: "VIDEO", label: "비디오" },
  { value: "CHAT", label: "채팅" },
  { value: "COMPLETION", label: "완성" },
  { value: "IMAGE_GENERATION", label: "이미지 생성" },
  { value: "AUDIO_TRANSCRIPTION", label: "오디오 전사" },
  { value: "AUDIO_SPEECH", label: "오디오 음성" },
];

const STATUS_OPTIONS: { value: ModelStatusEnum; label: string }[] = [
  { value: "STABLE", label: "안정" },
  { value: "BETA", label: "베타" },
  { value: "ALPHA", label: "알파" },
  { value: "DEPRECATED", label: "사용 중단" },
];

function ModelAddPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    model_name: "",
    provider: "",
    description: "",
    logo: "",
    endpoints_url: "",
    category: "TEXT" as AICategoryEnum,
    version: "",
    status: "STABLE" as ModelStatusEnum,
    max_tokens: "",
    max_input_tokens: "",
    max_output_tokens: "",
    input_cost_per_token: "",
    output_cost_per_token: "",
  });

  // 모델 생성 mutation
  const { mutate: createModel, isPending: isCreating } = usePostCatalog({
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["catalogs"],
      });
      // 생성된 모델 상세 페이지로 이동
      router.push(`/studio/templates/models/${data.id}`);
    },
    meta: {
      successMessage: "모델이 성공적으로 생성되었습니다.",
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 필수 필드 검증
    if (!formData.model_name.trim()) {
      toast.error("모델명을 입력해주세요.");
      return;
    }
    if (!formData.provider.trim()) {
      toast.error("제공자를 입력해주세요.");
      return;
    }
    if (!formData.version.trim()) {
      toast.error("버전을 입력해주세요.");
      return;
    }

    createModel({
      model_name: formData.model_name.trim(),
      provider: formData.provider.trim(),
      description: formData.description.trim() || null,
      logo: formData.logo.trim() || null,
      endpoints_url: formData.endpoints_url.trim() || null,
      category: formData.category,
      version: formData.version.trim(),
      status: formData.status,
      max_tokens: formData.max_tokens ? Number(formData.max_tokens) : null,
      max_input_tokens: formData.max_input_tokens
        ? Number(formData.max_input_tokens)
        : null,
      max_output_tokens: formData.max_output_tokens
        ? Number(formData.max_output_tokens)
        : null,
      input_cost_per_token: formData.input_cost_per_token
        ? Number(formData.input_cost_per_token)
        : null,
      output_cost_per_token: formData.output_cost_per_token
        ? Number(formData.output_cost_per_token)
        : null,
    });
  };

  return (
    <div className="py-8 px-4">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/studio/templates/models">
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
                  <Sparkles className="h-8 w-8" />새 모델 추가
                </h1>
                <p className="text-muted-foreground mt-1">
                  새로운 AI 모델을 카탈로그에 등록합니다
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button type="submit" className="shrink-0" disabled={isCreating}>
                <Save className="h-4 w-4 mr-2" />
                {isCreating ? "생성 중..." : "모델 생성"}
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
                  {/* 모델명 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="model_name"
                      className="flex items-center gap-2"
                    >
                      <Hash className="h-4 w-4" />
                      <span>모델명 *</span>
                    </Label>
                    <Input
                      id="model_name"
                      value={formData.model_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          model_name: e.target.value,
                        })
                      }
                      placeholder="예: GPT-4, Claude-3"
                      className="pl-6"
                      required
                    />
                  </div>

                  {/* 제공자 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="provider"
                      className="flex items-center gap-2"
                    >
                      <Building2 className="h-4 w-4" />
                      <span>제공자 *</span>
                    </Label>
                    <Input
                      id="provider"
                      value={formData.provider}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          provider: e.target.value,
                        })
                      }
                      placeholder="예: OpenAI, Anthropic"
                      className="pl-6"
                      required
                    />
                  </div>

                  {/* 카테고리 */}
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
                      onValueChange={(value: AICategoryEnum) =>
                        setFormData({ ...formData, category: value })
                      }
                      required
                    >
                      <SelectTrigger id="category" className="pl-6 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 버전 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="version"
                      className="flex items-center gap-2"
                    >
                      <Tag className="h-4 w-4" />
                      <span>버전 *</span>
                    </Label>
                    <Input
                      id="version"
                      value={formData.version}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          version: e.target.value,
                        })
                      }
                      placeholder="예: 1.0.0, v2"
                      className="pl-6"
                      required
                    />
                  </div>

                  {/* 상태 */}
                  <div className="space-y-2">
                    <Label htmlFor="status" className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <span>상태 *</span>
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: ModelStatusEnum) =>
                        setFormData({ ...formData, status: value })
                      }
                      required
                    >
                      <SelectTrigger id="status" className="pl-6 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 로고 URL */}
                  <div className="space-y-2">
                    <Label htmlFor="logo" className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      <span>로고 URL</span>
                    </Label>
                    <Input
                      id="logo"
                      type="url"
                      value={formData.logo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          logo: e.target.value,
                        })
                      }
                      placeholder="https://example.com/logo.png"
                      className="pl-6"
                    />
                  </div>

                  {/* 설명 */}
                  <div className="space-y-2 md:col-span-2">
                    <Label
                      htmlFor="description"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      <span>설명</span>
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
                      placeholder="모델에 대한 상세 설명을 입력하세요"
                      className="min-h-[100px]"
                      rows={4}
                    />
                  </div>

                  {/* 엔드포인트 URL */}
                  <div className="space-y-2 md:col-span-2">
                    <Label
                      htmlFor="endpoints_url"
                      className="flex items-center gap-2"
                    >
                      <Link2 className="h-4 w-4" />
                      <span>엔드포인트 URL</span>
                    </Label>
                    <Input
                      id="endpoints_url"
                      type="url"
                      value={formData.endpoints_url}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          endpoints_url: e.target.value,
                        })
                      }
                      placeholder="https://api.example.com/v1/models"
                      className="pl-6"
                    />
                    <p className="text-xs text-muted-foreground">
                      모델 연동 API URL을 입력하세요 (선택사항)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 토큰 설정 Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  토큰 설정
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 최대 토큰 수 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="max_tokens"
                      className="flex items-center gap-2"
                    >
                      <Hash className="h-4 w-4" />
                      <span>최대 토큰 수</span>
                    </Label>
                    <Input
                      id="max_tokens"
                      type="number"
                      value={formData.max_tokens}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          max_tokens: e.target.value,
                        })
                      }
                      placeholder="예: 4096"
                      className="pl-6"
                      min="0"
                    />
                  </div>

                  {/* 최대 입력 토큰 수 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="max_input_tokens"
                      className="flex items-center gap-2"
                    >
                      <Hash className="h-4 w-4" />
                      <span>최대 입력 토큰 수</span>
                    </Label>
                    <Input
                      id="max_input_tokens"
                      type="number"
                      value={formData.max_input_tokens}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          max_input_tokens: e.target.value,
                        })
                      }
                      placeholder="예: 2048"
                      className="pl-6"
                      min="0"
                    />
                  </div>

                  {/* 최대 출력 토큰 수 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="max_output_tokens"
                      className="flex items-center gap-2"
                    >
                      <Hash className="h-4 w-4" />
                      <span>최대 출력 토큰 수</span>
                    </Label>
                    <Input
                      id="max_output_tokens"
                      type="number"
                      value={formData.max_output_tokens}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          max_output_tokens: e.target.value,
                        })
                      }
                      placeholder="예: 2048"
                      className="pl-6"
                      min="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 비용 설정 Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  비용 설정
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 입력 토큰당 비용 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="input_cost_per_token"
                      className="flex items-center gap-2"
                    >
                      <Coins className="h-4 w-4" />
                      <span>입력 토큰당 비용</span>
                    </Label>
                    <Input
                      id="input_cost_per_token"
                      type="number"
                      step="0.0000001"
                      value={formData.input_cost_per_token}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          input_cost_per_token: e.target.value,
                        })
                      }
                      placeholder="예: 0.00001"
                      className="pl-6"
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">
                      입력 토큰 1개당 비용을 입력하세요
                    </p>
                  </div>

                  {/* 출력 토큰당 비용 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="output_cost_per_token"
                      className="flex items-center gap-2"
                    >
                      <Coins className="h-4 w-4" />
                      <span>출력 토큰당 비용</span>
                    </Label>
                    <Input
                      id="output_cost_per_token"
                      type="number"
                      step="0.0000001"
                      value={formData.output_cost_per_token}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          output_cost_per_token: e.target.value,
                        })
                      }
                      placeholder="예: 0.00003"
                      className="pl-6"
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">
                      출력 토큰 1개당 비용을 입력하세요
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
                * 표시된 필드는 필수 입력 항목입니다. 모델 생성 후 추가 정보는
                모델 상세 페이지에서 수정할 수 있습니다.
              </span>
            </AlertDescription>
          </Alert>
        </div>
      </form>
    </div>
  );
}

export default ModelAddPage;
