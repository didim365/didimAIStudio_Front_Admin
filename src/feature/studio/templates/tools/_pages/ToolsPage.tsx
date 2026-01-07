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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";
import { RefreshCw, Plus } from "lucide-react";
import { useQueryParam } from "@/shared/hooks/useQueryParams";
import { useGetTools } from "../_hooks/useGetTools";
import { providerConfig, statusConfig } from "../_constants/toolConfigs";
import { Pagination } from "@/shared/ui/pagination";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ToolsPage() {
  const router = useRouter();
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

  const { data, isLoading, refetch } = useGetTools(queryParams);

  const handleViewDetails = (toolId: number) => {
    router.push(`/studio/templates/tools/${toolId}`);
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">도구 템플릿 관리</h1>
        <p className="mt-2 text-slate-600">
          등록된 MCP 도구 템플릿을 관리합니다
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
                  className={cn("h-4 w-4", isLoading && "animate-spin")}
                />
                새로고침
              </Button>
            </div>
            <div className="flex gap-2 ml-auto">
              <Link href="/studio/templates/tools/add">
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
            도구 목록 ({data?.total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">ID</TableHead>
                  <TableHead>도구 이름</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead className="text-center">제공업체</TableHead>
                  <TableHead className="text-center">카테고리</TableHead>
                  <TableHead className="text-center">버전</TableHead>
                  <TableHead className="text-center">상태</TableHead>
                  <TableHead className="text-center">사용 횟수</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items.map((tool) => (
                  <TableRow
                    key={tool.id}
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => handleViewDetails(tool.id)}
                  >
                    <TableCell className="text-center">
                      <span className="text-sm font-mono">{tool.id}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {tool.icon_url && (
                          <div className="relative w-10 h-10 shrink-0">
                            <Image
                              src={tool.icon_url}
                              alt={tool.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{tool.name}</div>
                          {tool.definition_name && (
                            <div className="text-xs text-slate-500">
                              {tool.definition_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate">{tool.description || "-"}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={providerConfig[tool.provider].color}
                      >
                        {providerConfig[tool.provider].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm">{tool.category}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm font-mono">{tool.version}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={statusConfig[tool.status].color}
                      >
                        {statusConfig[tool.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm">{tool.usage_count || 0}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
