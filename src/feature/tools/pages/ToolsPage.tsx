"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { RefreshCw, Plus } from "lucide-react";
import { useQueryParam } from "@/shared/hooks/useQueryParams";
import { useGetMcpTools } from "../hooks/useGetMcpTools";
import { ToolsTable } from "../components/ToolsTable";
import { statusConfig } from "../constants/toolConfigs";
import { Pagination } from "@/shared/ui/pagination";
import Link from "next/link";

export default function ToolsPage() {
  const [statusFilter, setStatusFilter] = useQueryParam<string>(
    "status",
    "all"
  );
  const [page, setPage] = useQueryParam<number>("page", 1);

  const queryParams = {
    page,
    status_filter:
      statusFilter === "all"
        ? undefined
        : (statusFilter as "ACTIVE" | "INACTIVE" | "PENDING" | "ERROR"),
    include_config: false,
  };

  const { data, isLoading, refetch } = useGetMcpTools(queryParams);

  const tools = data?.items || [];

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
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
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
            <div className="flex gap-2">
              <Link href="/studio/tools/add">
                <Button className="gap-2 cursor-pointer">
                  <Plus className="h-4 w-4" />
                  도구 추가
                </Button>
              </Link>
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
          {!isLoading && <ToolsTable tools={tools} />}
        </CardContent>
      </Card>

      {/* 페이지네이션 */}
      {data && data.pages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={data.page}
            totalPages={data.pages}
            onPageChange={(newPage) => setPage(newPage)}
            hasPrevious={data.has_prev}
            hasNext={data.has_next}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}
