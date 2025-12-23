"use client";

import { useGetPrivateModels } from "../_hooks/useGetPrivateModels";
import { DeploymentStatusBadge } from "../_components/DeploymentStatusBadge";
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
import {
  RefreshCw,
  AlertCircle,
  Server,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { formatDate } from "@/shared/utils/formatDate";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";

function PrivateModels() {
  const { data, isLoading, refetch } = useGetPrivateModels();

  const models = data?.models || [];
  const totalCount = data?.total_count || 0;

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">로컬 LLM 관리</h1>
        <p className="mt-2 text-slate-600">
          GPUStack에 배포된 모델을 조회하고 관리하세요
        </p>
      </div>

      {/* 필터 및 액션 */}
      <Card className="mb-6">
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-slate-600">
                <Server className="h-5 w-5" />
                <span className="text-sm font-medium">
                  총 {totalCount}개의 로컬 LLM
                </span>
              </div>
            </div>
            <div className="flex gap-2">
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
              <Link href="/studio/templates/models/private/add">
                <Button className="gap-2 cursor-pointer">
                  <Plus className="h-4 w-4" />
                  로컬 LLM 템플릿 생성
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 모델 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            로컬 LLM 목록 ({totalCount})
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
              <p className="text-lg font-medium">로컬 LLM이 없습니다</p>
              <p className="text-sm">로컬 LLM이 추가되면, 여기에 표시됩니다</p>
            </div>
          )}
          {!isLoading && models.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">모델 ID</TableHead>
                    <TableHead className="text-left">모델 이름</TableHead>
                    <TableHead className="text-center">상태</TableHead>
                    <TableHead className="text-center">사용 가능</TableHead>
                    <TableHead className="text-left">백엔드</TableHead>
                    <TableHead className="text-center">생성일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {models.map((model) => (
                    <TableRow
                      key={model.id || `model-${Math.random()}`}
                      className="group hover:bg-slate-50 transition-colors"
                    >
                      <TableCell className="text-left font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {model.id || "N/A"}
                          </code>
                        </div>
                      </TableCell>
                      <TableCell className="text-left">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {model.name || "이름 없음"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <DeploymentStatusBadge
                            status={model.status || "unknown"}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          {model.ready ? (
                            <Badge
                              variant="default"
                              className="flex items-center gap-1 w-fit bg-green-500 hover:bg-green-600"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              사용 가능
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1 w-fit"
                            >
                              사용 불가
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-left">
                        {model.backend ? (
                          <Badge
                            variant="outline"
                            className="font-mono text-xs"
                          >
                            {model.backend}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            정보 없음
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground">
                        {formatDate(model.created_at || null)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default PrivateModels;
