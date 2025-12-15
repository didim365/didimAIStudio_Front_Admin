"use client";

import { useState, FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePutCatalog } from "../_hooks/usePutCatalog";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
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
  Image as ImageIcon,
  Activity,
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
import { Separator } from "@/shared/ui/separator";
import { Badge } from "@/shared/ui/badge";
import type { GetCatalogResponse } from "../../_api/getCatalog";
import type {
  AICategoryEnum,
  ModelStatusEnum,
} from "../../../_types/modelTypes";
import {
  CATEGORY_OPTIONS,
  STATUS_OPTIONS,
} from "../../../_constants/modelConstants";
import { getInitials } from "../../_utils/getInitials";
import { getStatusBadgeVariant } from "../../_utils/getStatusBadgeVariant";

interface ModelEditPageProps {
  catalog: GetCatalogResponse;
}

function ModelEditPage({ catalog }: ModelEditPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    model_name: catalog.model_name || "",
    provider: catalog.provider || "",
    description: catalog.description || "",
    logo: catalog.logo || "",
    endpoints_url: catalog.endpoints_url || "",
    category: (catalog.category || "TEXT") as AICategoryEnum,
    version: catalog.version || "",
    status: (catalog.status || "STABLE") as ModelStatusEnum,
    max_tokens: catalog.max_tokens?.toString() || "",
    max_input_tokens: catalog.max_input_tokens?.toString() || "",
    max_output_tokens: catalog.max_output_tokens?.toString() || "",
    input_cost_per_token: catalog.input_cost_per_token?.toString() || "",
    output_cost_per_token: catalog.output_cost_per_token?.toString() || "",
  });

  const { mutate: updateCatalog, isPending: isUpdating } = usePutCatalog({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["catalogs"],
      });
      queryClient.invalidateQueries({
        queryKey: ["catalog", catalog.id],
      });
      router.push(`/studio/templates/models/${catalog.id}`);
    },
    meta: {
      successMessage: "모델 정보가 성공적으로 수정되었습니다.",
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateCatalog({
      params: { model_id: catalog.id },
      data: {
        model_name: formData.model_name.trim(),
        provider: formData.provider.trim(),
        description: formData.description.trim() || null,
        logo: formData.logo.trim() || null,
        endpoints_url: formData.endpoints_url.trim() || null,
        category: formData.category || null,
        version: formData.version.trim() || null,
        status: formData.status || null,
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
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={`/studio/templates/models/${catalog.id}`}>
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
                모델 정보 수정
              </h1>
              <p className="text-muted-foreground">모델 ID: {catalog.id}</p>
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
          {/* Basic Info Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Logo / Status */}
                <div className="flex flex-col items-center gap-4 min-w-[150px]">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                    <AvatarImage
                      src={formData.logo || undefined}
                      alt={formData.model_name}
                    />
                    <AvatarFallback className="text-3xl">
                      {getInitials(formData.model_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Badge variant={getStatusBadgeVariant(formData.status)}>
                      {formData.status}
                    </Badge>
                    <Badge variant="outline">{formData.category}</Badge>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="flex-1 grid gap-4 md:grid-cols-2">
                  {/* Model Name */}
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

                  {/* Provider */}
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

                  {/* Version */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="version"
                      className="flex items-center gap-2"
                    >
                      <Tag className="h-4 w-4" />
                      <span>버전</span>
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
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status" className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
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

                  {/* Logo URL */}
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
                </div>
              </div>

              <Separator className="my-6" />

              {/* Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <FileText className="h-4 w-4 text-muted-foreground" />
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

              <Separator className="my-6" />

              {/* Endpoints URL */}
              <div className="space-y-2">
                <Label
                  htmlFor="endpoints_url"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <Link2 className="h-4 w-4 text-muted-foreground" />
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
            </CardContent>
          </Card>

          {/* Token Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                토큰 설정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Max Tokens */}
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

                {/* Max Input Tokens */}
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

                {/* Max Output Tokens */}
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

          {/* Cost Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                비용 설정 (per token)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Input Cost Per Token */}
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

                {/* Output Cost Per Token */}
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
      </div>
    </form>
  );
}

export default ModelEditPage;
