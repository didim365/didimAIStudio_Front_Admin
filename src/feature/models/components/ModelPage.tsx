"use client";

import { useState } from "react";
import { components } from "@/shared/types/api/models";
import useGetCatalog from "../hooks/useGetCatalog";
import ModelTable from "./ModelTable";
import { Card, CardContent } from "@/shared/ui/card";
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
  const [size, setSize] = useState(10);
  const [category, setCategory] = useState<string>("all");
  const [provider, setProvider] = useState<string>("");
  const [deploymentType, setDeploymentType] = useState<string>("all");

  const { data, isLoading, refetch } = useGetCatalog({
    category: category === "all" ? undefined : (category as AICategoryEnum),
    provider: provider || undefined,
    deployment_type: deploymentType === "all" ? undefined : deploymentType,
    page,
    size,
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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

      {/* 검색 및 필터 */}
      <Card className="mb-6">
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="모델 이름, 설명, 제공자로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
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
                className="w-full sm:w-[180px]"
              />

              <Select value={deploymentType} onValueChange={setDeploymentType}>
                <SelectTrigger className="w-full sm:w-[180px]">
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

      {/* Statistics */}
      {data && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {data.total.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">전체 모델</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {data.total_pages.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">총 페이지</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {data.items.length.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  현재 페이지
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">{page}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  현재 페이지 번호
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Table */}
      <ModelTable models={filteredModels} isLoading={isLoading} />

      {/* Pagination */}
      {data && data.total_pages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            이전
          </Button>
          <div className="flex items-center gap-2 px-4">
            <span className="text-sm text-slate-600">
              {page} / {data.total_pages}
            </span>
          </div>
          <Button
            variant="outline"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= data.total_pages}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}

export default ModelPage;
