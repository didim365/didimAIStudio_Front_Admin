"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { RefreshCw } from "lucide-react";
import { useQueryParam } from "@/shared/hooks/useQueryParams";
import { useGetMcpTools } from "../hooks/useGetMcpTools";
import { ToolsTable } from "../components/ToolsTable";

export default function ToolsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useQueryParam<string>(
    "status",
    "all"
  );
  const [page, setPage] = useQueryParam<number>("page", 1);
  const pageSize = 20;

  const queryParams = {
    page,
    size: pageSize,
    status_filter:
      statusFilter === "all"
        ? undefined
        : (statusFilter as "ACTIVE" | "INACTIVE" | "PENDING" | "ERROR"),
    include_config: false,
  };

  const { data, isLoading, refetch } = useGetMcpTools(queryParams);

  const tools = data?.items || [];

  const handleViewDetails = (toolId: number) => {
    router.push(`/service/tools/${toolId}`);
  };

  const handlePrevPage = () => {
    setPage(Math.max(1, page - 1));
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">도구 관리</h1>
        <p className="mt-2 text-slate-600">
          등록된 모든 MCP 도구 템플릿을 관리합니다
        </p>
      </div>

      {/* 검색 및 필터 */}
      <Card className="mb-6">
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="상태 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 상태</SelectItem>
                  <SelectItem value="ACTIVE">활성</SelectItem>
                  <SelectItem value="INACTIVE">비활성</SelectItem>
                  <SelectItem value="PENDING">대기 중</SelectItem>
                  <SelectItem value="ERROR">오류</SelectItem>
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

      {/* 도구 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            도구 목록 ({tools.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-8 text-slate-500">로딩 중...</div>
          )}
          {!isLoading && (
            <ToolsTable tools={tools} onViewDetails={handleViewDetails} />
          )}
        </CardContent>
      </Card>

      {/* 페이지네이션 */}
      {data && data.pages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={handlePrevPage}
            disabled={!data.has_prev || isLoading}
          >
            이전
          </Button>
          <div className="flex items-center gap-2 px-4">
            <span className="text-sm text-slate-600">
              {data.page} / {data.pages}
            </span>
          </div>
          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={!data.has_next || isLoading}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}
