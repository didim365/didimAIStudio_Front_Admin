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
import { useGetUserConfigs } from "../_hooks/useGetUserConfigs";
import { cn } from "@/shared/lib/utils";
import { STATUS_CONFIG } from "../_constants/containerConfigs";
import { formatDate } from "@/shared/utils/formatDate";

export default function ToolsPage() {
  const { data, refetch, isFetching } = useGetUserConfigs();

  const isLoading = isFetching && !data;

  const handleRefresh = () => {
    refetch();
  };

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
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-600">
                총{" "}
                <span className="font-semibold text-slate-900">
                  {data?.total ?? 0}
                </span>
                개의 컨테이너
              </div>
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
        </CardContent>
      </Card>

      {/* 컨테이너 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">컨테이너 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-8 text-slate-500">로딩 중...</div>
          )}
          {!isLoading && (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center w-20">
                      Config ID
                    </TableHead>
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
                        className="hover:bg-slate-50 transition-colors"
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
