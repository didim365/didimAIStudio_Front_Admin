"use client";

import { components } from "@/shared/types/api/models";
import { useQueryParam } from "@/shared/hooks/useQueryParams";
import useGetCatalog from "../_hooks/useGetCatalog";
import { StatusBadge } from "../_components/StatusBadge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { RefreshCw, AlertCircle, ExternalLink } from "lucide-react";
import { Pagination } from "@/shared/ui/pagination";
import { formatDate } from "@/shared/utils/formatDate";
import { useRouter } from "next/navigation";
import { CATEGORIES, DEPLOYMENT_TYPES } from "../_constants/modelConstants";
import {
  getCategoryLabel,
  formatNumber,
  formatCost,
} from "../_utils/modelUtils";

type AICategoryEnum = components["schemas"]["AICategoryEnum"];

function ModelsPage() {
  const router = useRouter();

  // URL 쿼리 파라미터 관리 - useState와 동일한 API
  const [page, setPage] = useQueryParam<number>("page", 1);
  const [category, setCategory] = useQueryParam<string>("category", "all");
  const [provider, setProvider] = useQueryParam<string>("provider", "", {
    debounce: 300,
  });
  const [deploymentType, setDeploymentType] = useQueryParam<string>(
    "deploymentType",
    "all"
  );

  const { data, isLoading, refetch } = useGetCatalog({
    category: category === "all" ? undefined : (category as AICategoryEnum),
    provider: provider || undefined,
    deployment_type: deploymentType === "all" ? undefined : deploymentType,
    page,
  });

  const models = data?.items || [];

  function handleRowClick(modelId: number) {
    router.push(`/studio/models/${modelId}`);
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">모델 관리</h1>
        <p className="mt-2 text-slate-600">
          시스템의 모든 AI 모델을 관리하세요
        </p>
      </div>

      {/* 필터 */}
      <Card className="mb-6">
        <CardContent>
          <div className="flex flex-col gap-4">
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
            모델 목록 ({data?.total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4" />
              <p className="text-slate-500">로딩 중...</p>
            </div>
          )}
          {!isLoading && models.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium">모델을 찾을 수 없습니다</p>
              <p className="text-sm">필터 조건을 변경해보세요</p>
            </div>
          )}
          {!isLoading && models.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center w-[5%]">ID</TableHead>
                    <TableHead className="text-left w-[15%]">모델</TableHead>
                    <TableHead className="text-center w-[8%]">
                      카테고리
                    </TableHead>
                    <TableHead className="text-left w-[6%]">버전</TableHead>
                    <TableHead className="text-center w-[7%]">상태</TableHead>
                    <TableHead className="text-center w-[8%]">
                      최대 토큰
                    </TableHead>
                    <TableHead className="text-center w-[8%]">
                      입력 토큰
                    </TableHead>
                    <TableHead className="text-center w-[8%]">
                      출력 토큰
                    </TableHead>
                    <TableHead className="text-center w-[9%]">
                      입력 비용
                    </TableHead>
                    <TableHead className="text-center w-[9%]">
                      출력 비용
                    </TableHead>
                    <TableHead className="text-center w-[10%]">
                      생성일
                    </TableHead>
                    <TableHead className="text-center w-[7%]">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {models.map((model) => (
                    <TableRow
                      key={model.id}
                      className="group cursor-pointer hover:bg-slate-50"
                      onClick={() => handleRowClick(model.id)}
                    >
                      <TableCell className="text-center font-mono text-sm text-muted-foreground">
                        {model.id}
                      </TableCell>
                      <TableCell className="text-left">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={model.logo || undefined}
                              alt={model.model_name}
                            />
                            <AvatarFallback>
                              {model.model_name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {model.model_name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {model.provider}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <Badge variant="outline">
                            {getCategoryLabel(model.category)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-left">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          v{model.version}
                        </code>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <StatusBadge status={model.status} />
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-mono text-sm">
                        {formatNumber(model.max_tokens)}
                      </TableCell>
                      <TableCell className="text-center font-mono text-sm">
                        {formatNumber(model.max_input_tokens)}
                      </TableCell>
                      <TableCell className="text-center font-mono text-sm">
                        {formatNumber(model.max_output_tokens)}
                      </TableCell>
                      <TableCell className="text-center font-mono text-sm">
                        {formatCost(model.input_cost_per_token)}
                      </TableCell>
                      <TableCell className="text-center font-mono text-sm">
                        {formatCost(model.output_cost_per_token)}
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground">
                        {formatDate(model.created_at)}
                      </TableCell>
                      <TableCell className="text-center">
                        {model.endpoints_url && (
                          <div className="flex justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(model.endpoints_url!, "_blank");
                              }}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 페이지네이션 */}
      {data && (
        <div className="mt-6">
          <Pagination
            currentPage={data.page}
            totalPages={data.total_pages}
            onPageChange={(newPage) => setPage(newPage)}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}

export default ModelsPage;
