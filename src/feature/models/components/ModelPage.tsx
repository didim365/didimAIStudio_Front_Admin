"use client";

import { useState } from "react";
import { components } from "@/shared/types/api/models";
import useGetCatalog from "../hooks/useGetCatalog";
import ModelTable from "./ModelTable";
import { ModelStatsCards } from "./ModelStatsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Search, RefreshCw } from "lucide-react";

type AICategoryEnum = components["schemas"]["AICategoryEnum"];

const CATEGORIES = [
  { value: "TEXT", label: "텍스트" },
  { value: "IMAGE", label: "이미지" },
  { value: "MULTIMODAL", label: "멀티모달" },
  { value: "EMBEDDING", label: "임베딩" },
  { value: "AUDIO", label: "오디오" },
  { value: "VIDEO", label: "비디오" },
  { value: "CHAT", label: "채팅" },
  { value: "COMPLETION", label: "완성" },
  { value: "IMAGE_GENERATION", label: "이미지 생성" },
  { value: "AUDIO_TRANSCRIPTION", label: "오디오 변환" },
  { value: "AUDIO_SPEECH", label: "음성 합성" },
];

const DEPLOYMENT_TYPES = [
  { value: "PRIVATE_VLLM", label: "Private vLLM" },
  { value: "PUBLIC_API", label: "Public API" },
];

function ModelPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string>("all");
  const [provider, setProvider] = useState<string>("");
  const [deploymentType, setDeploymentType] = useState<string>("all");

  const { data, isLoading, refetch } = useGetCatalog({
    category: category === "all" ? undefined : (category as AICategoryEnum),
    provider: provider || undefined,
    deployment_type: deploymentType === "all" ? undefined : deploymentType,
    page,
  });

  const models = data?.items || [];
  const filteredModels = !searchQuery
    ? models
    : models.filter((model) => {
        const query = searchQuery.toLowerCase();
        return (
          model.model_name.toLowerCase().includes(query) ||
          model.description?.toLowerCase().includes(query) ||
          model.provider.toLowerCase().includes(query)
        );
      });

  const stats = {
    total: data?.total || 0,
    privateVllm: models.filter(
      (model) => model.deployment_type === "PRIVATE_VLLM"
    ).length,
    publicApi: models.filter((model) => model.deployment_type === "PUBLIC_API")
      .length,
    filtered: filteredModels.length,
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">AI 모델 카탈로그</h1>
        <p className="mt-2 text-slate-600">
          시스템의 모든 AI 모델을 검색하고 관리하세요
        </p>
      </div>

      {/* 통계 카드 */}
      <ModelStatsCards {...stats} />

      {/* 검색 및 필터 */}
      <Card className="mb-6">
        <CardContent>
          <div className="flex flex-col gap-4">
            {/* 검색 바 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="모델 이름, 설명, 제공자로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* 필터 옵션 */}
            <div className="flex flex-wrap gap-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="카테고리" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 카테고리</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="제공자 필터..."
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-[180px]"
              />

              <Select value={deploymentType} onValueChange={setDeploymentType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="배포 타입" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 배포 타입</SelectItem>
                  {DEPLOYMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="gap-2"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                새로고침
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 모델 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            모델 목록 ({filteredModels.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-slate-500">로딩 중...</p>
            </div>
          )}
          {!isLoading && (
            <ModelTable models={filteredModels} />
          )}
        </CardContent>
      </Card>

      {/* 페이지네이션 */}
      {data && data.total_pages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
          >
            이전
          </Button>
          <div className="flex items-center gap-2 px-4">
            <span className="text-sm text-slate-600">
              {data.page} / {data.total_pages}
            </span>
          </div>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === data.total_pages || isLoading}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}

export default ModelPage;
