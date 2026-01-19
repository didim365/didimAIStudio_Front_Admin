"use client";

import { useGetLocalModels } from "../_hooks/useGetLocalModels";
import { useSyncGPUStack } from "../_hooks/useSyncGPUStack";
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
import { AlertCircle, Server, RefreshCw, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/shared/lib/utils";
import { getDeploymentStatusLabel } from "../_utils/deploymentStatus";
import Link from "next/link";

function LocalModels() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetLocalModels();

  const models = data?.items || [];
  const totalCount = data?.total || 0;

  // GPUStack 동기화 mutation
  const syncMutation = useSyncGPUStack({
    onSuccess: () => {
      // 동기화 성공 시 캐시 무효화하여 새 데이터 로드
      queryClient.invalidateQueries({ queryKey: ["admin", "models", "local"] });
    },
    meta: {
      successMessage: "GPUStack 모델 동기화가 완료되었습니다",
    },
  });

  const handleRowClick = (modelId: number) => {
    router.push(`/studio/templates/models/local/${modelId}`);
  };

  const handleSync = () => {
    syncMutation.mutate({
      dry_run: false,
      force: false,
    });
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-8 p-6 rounded-lg">
        <h1 className="text-3xl font-bold text-slate-800">로컬 LLM 관리</h1>
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
                className="gap-2 cursor-pointer"
                onClick={handleSync}
                disabled={syncMutation.isPending}
              >
                <RefreshCw
                  className={cn(
                    "h-4 w-4",
                    syncMutation.isPending && "animate-spin"
                  )}
                />
                GPUStack 동기화
              </Button>
              <Link href="/studio/templates/models/local/add">
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">모델 ID</TableHead>
                    <TableHead className="text-center">
                      GPUStack 모델 ID
                    </TableHead>
                    <TableHead className="text-center">모델 이름</TableHead>
                    <TableHead className="text-center">배포 상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {models.map((model) => (
                    <TableRow
                      key={model.model_id}
                      className="group hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => handleRowClick(model.model_id)}
                    >
                      <TableCell className="text-center font-mono text-sm">
                        <div className="flex items-center justify-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {model.model_id}
                          </code>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-mono text-sm">
                        <div className="flex items-center justify-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {model.gpustack_model_id || "N/A"}
                          </code>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-medium">
                            {model.model_name || "이름 없음"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <Badge
                            variant={
                              model.deployment_status === "running"
                                ? "default"
                                : "secondary"
                            }
                            className={cn(
                              model.deployment_status === "running" &&
                                "bg-green-500 hover:bg-green-600"
                            )}
                          >
                            {getDeploymentStatusLabel(model.deployment_status)}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LocalModels;
