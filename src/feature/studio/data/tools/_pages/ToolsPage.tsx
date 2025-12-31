"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
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
import { RefreshCw, Search } from "lucide-react";
import { useGetUserConfigs } from "../_hooks/useGetUserConfigs";
import { cn } from "@/shared/lib/utils";
import { STATUS_CONFIG, STATUS_OPTIONS } from "../_constants/containerConfigs";
import { formatDate } from "@/shared/utils/formatDate";
import { useQueryParam } from "@/shared/hooks/useQueryParams";
import { Pagination } from "@/shared/ui/pagination";

export default function ToolsPage() {
  const router = useRouter();

  // 필터 상태 관리
  const [userId, setUserId] = useQueryParam<string>("user_id", "", {
    debounce: 300,
  });
  const [toolId, setToolId] = useQueryParam<string>("tool_id", "", {
    debounce: 300,
  });
  const [containerStatus, setContainerStatus] = useQueryParam<string>(
    "container_status",
    "all"
  );
  const [configName, setConfigName] = useQueryParam<string>("config_name", "", {
    debounce: 300,
  });

  // 페이지네이션
  const [page, setPage] = useQueryParam<number>("page", 1);
  // API 호출 파라미터 구성
  const queryParams = {
    user_id: userId || undefined,
    tool_id: toolId ? Number(toolId) : undefined,
    container_status:
      containerStatus === "all" ? undefined : containerStatus || undefined,
    config_name: configName || undefined,
    page,
    size: 10,
  };

  const { data, refetch, isFetching } = useGetUserConfigs(queryParams);

  const handleRefresh = () => {
    refetch();
  };

  const handleRowClick = (configId: number) => {
    router.push(`/studio/data/tools/${configId}`);
  };

  // 전체 페이지 수 계산
  const totalPages = data ? Math.ceil(data.total / data.size) : 0;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">컨테이너 관리</h1>
        <p className="mt-2 text-slate-600">
          전체 컨테이너의 상세 정보를 조회하고 관리합니다
        </p>
      </div>

      {/* 검색 및 필터 */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* 첫 번째 행: 검색 필드들 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 사용자 ID 검색 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  사용자 ID
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="사용자 ID 입력"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* 도구 ID 검색 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  도구 ID
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="도구 ID 입력"
                    value={toolId}
                    onChange={(e) => setToolId(e.target.value)}
                    className="pl-10"
                    type="number"
                  />
                </div>
              </div>

              {/* 컨테이너 상태 필터 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  컨테이너 상태
                </label>
                <Select
                  value={containerStatus}
                  onValueChange={setContainerStatus}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="상태 선택" />
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

              {/* 설정 이름 검색 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  설정 이름
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="설정 이름 검색"
                    value={configName}
                    onChange={(e) => setConfigName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* 두 번째 행: 통계 및 새로고침 */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="text-sm text-slate-600">
                총{" "}
                <span className="font-semibold text-slate-900">
                  {data?.total ?? 0}
                </span>
                개의 컨테이너
                {data && totalPages > 1 && (
                  <span className="ml-2">
                    (페이지 {data.page} / {totalPages})
                  </span>
                )}
              </div>
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleRefresh}
                disabled={isFetching}
              >
                <RefreshCw
                  className={cn("h-4 w-4", isFetching && "animate-spin")}
                />
                새로고침
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 컨테이너 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">컨테이너 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center w-20">Config ID</TableHead>
                  <TableHead>설정 이름</TableHead>
                  <TableHead>도구 이름</TableHead>
                  <TableHead className="text-center">사용자 ID</TableHead>
                  <TableHead className="text-center">상태</TableHead>
                  <TableHead className="text-center">활성화</TableHead>
                  <TableHead className="text-center">생성 시간</TableHead>
                  <TableHead className="text-center">수정 시간</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items?.map((config, index) => {
                  const statusConfig = config.container_status
                    ? STATUS_CONFIG[
                        config.container_status.toLowerCase() as keyof typeof STATUS_CONFIG
                      ] || STATUS_CONFIG.pending
                    : STATUS_CONFIG.pending;

                  return (
                    <TableRow
                      key={`${config.config_id}-${config.user_id}-${index}`}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => handleRowClick(config.config_id)}
                    >
                      <TableCell className="text-center">
                        <span className="text-sm font-mono font-medium">
                          {config.config_id}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {config.config_name || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {config.tool_name || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm font-mono">
                          {config.user_id || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {config.container_status ? (
                          <Badge
                            variant={statusConfig.variant}
                            className={cn(
                              "flex items-center gap-1 w-fit mx-auto",
                              statusConfig.className
                            )}
                          >
                            {statusConfig.icon}
                            {statusConfig.label}
                          </Badge>
                        ) : (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={config.is_active ? "default" : "secondary"}
                          className="w-fit mx-auto"
                        >
                          {config.is_active ? "활성" : "비활성"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-xs text-slate-600">
                          {config.created_at
                            ? formatDate(config.created_at)
                            : "-"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-xs text-slate-600">
                          {config.updated_at
                            ? formatDate(config.updated_at)
                            : "-"}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 페이지네이션 */}
      {data && totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={data.page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
            isLoading={isFetching}
          />
        </div>
      )}
    </div>
  );
}
