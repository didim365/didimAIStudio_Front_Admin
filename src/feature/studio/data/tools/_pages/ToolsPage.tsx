"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";
import { RefreshCw } from "lucide-react";
import { useGetContainers } from "../_hooks/useGetContainers";
import { cn } from "@/shared/lib/utils";
import { useEffect } from "react";
import {
  STATUS_CONFIG,
  HEALTH_STATUS_CONFIG,
} from "../_constants/containerConfigs";

function formatDate(dateString: string | null) {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}

export default function ToolsPage() {
  const { data, mutate, isPending } = useGetContainers({
    onSuccess: () => {
      // 데이터 로드 성공 처리
    },
  });

  const containers = data || [];
  const isLoading = isPending && !data;

  const handleRefresh = () => {
    mutate(undefined);
  };

  useEffect(() => {
    mutate(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">컨테이너 관리</h1>
        <p className="mt-2 text-slate-600">
          전체 컨테이너의 상세 정보를 조회하고 관리합니다
        </p>
      </div>

      {/* 액션 바 */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-600">
                총{" "}
                <span className="font-semibold text-slate-900">
                  {containers.length}
                </span>
                개의 컨테이너
              </div>
            </div>
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleRefresh}
              disabled={isPending}
            >
              <RefreshCw
                className={cn("h-4 w-4", isPending && "animate-spin")}
              />
              새로고침
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 컨테이너 테이블 */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-lg font-semibold">컨테이너 목록</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading && (
            <div className="text-center py-12 text-slate-500">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p>컨테이너 정보를 불러오는 중...</p>
            </div>
          )}
          {!isLoading && (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center w-20">
                      Config ID
                    </TableHead>
                    <TableHead>도구 이름</TableHead>
                    <TableHead>컨테이너 이름</TableHead>
                    <TableHead className="text-center">사용자 ID</TableHead>
                    <TableHead className="text-center">포트</TableHead>
                    <TableHead className="text-center">상태</TableHead>
                    <TableHead className="text-center">헬스 상태</TableHead>
                    <TableHead className="text-center">
                      마지막 헬스 체크
                    </TableHead>
                    <TableHead className="text-center">생성 시간</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {containers.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center py-12 text-slate-500"
                      >
                        등록된 컨테이너가 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                  {containers.map((container, index) => {
                    const statusConfig =
                      STATUS_CONFIG[
                        container.container_status?.toLowerCase()
                      ] || STATUS_CONFIG.pending;
                    const healthConfig =
                      HEALTH_STATUS_CONFIG[
                        container.health_status?.toLowerCase() || "unknown"
                      ] || HEALTH_STATUS_CONFIG.unknown;

                    return (
                      <TableRow
                        key={`${container.config_id}-${container.user_id}-${index}`}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <TableCell className="text-center">
                          <span className="text-sm font-mono font-medium">
                            {container.config_id}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {container.tool_name || "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-mono text-sm">
                            {container.container_name || "-"}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-sm font-mono">
                            {container.user_id || "-"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {container.container_port ? (
                            <span className="text-sm font-mono font-medium">
                              {container.container_port}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
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
                        </TableCell>
                        <TableCell className="text-center">
                          {container.health_status ? (
                            <Badge
                              variant={healthConfig.variant}
                              className={cn(
                                "flex items-center gap-1 w-fit mx-auto",
                                healthConfig.className
                              )}
                            >
                              {healthConfig.label}
                            </Badge>
                          ) : (
                            <span className="text-sm text-slate-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-xs text-slate-600">
                            {formatDate(container.last_health_check)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-xs text-slate-600">
                            {formatDate(container.created_at)}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
