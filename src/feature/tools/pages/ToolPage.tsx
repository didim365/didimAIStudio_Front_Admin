"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import {
  Wrench,
  ArrowLeft,
  Pencil,
  Trash2,
  Hash,
  Package,
  Tag,
  Server,
  Activity,
  Clock,
  TrendingUp,
  Zap,
  Calendar,
  Code2,
  FileCode,
  GitBranch,
  Loader2,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { formatDate } from "@/shared/utils/formatDate";
import Image from "next/image";
import {
  statusConfig,
  providerConfig,
  deploymentTypeConfig,
} from "../constants/toolConfigs";
import { GetToolResponse } from "../api/getTool";
import { useDeleteTool } from "../hooks/useDeleteTool";
import { GetToolConfigResponse } from "../api/getToolConfig";
import { ServerConfigCard } from "../components/ServerConfigCard";

function ToolPage({
  tool,
  config,
}: {
  tool: GetToolResponse;
  config: GetToolConfigResponse;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // 도구 삭제 mutation
  const { mutate: deleteTool, isPending: isDeleting } = useDeleteTool({
    onSuccess: () => {
      // 도구 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ["mcp-tools"],
      });
      router.push("/studio/tools");
    },
    meta: {
      successMessage: "도구가 성공적으로 삭제되었습니다.",
    },
  });

  const handleDelete = () => {
    deleteTool({ tool_id: tool.id });
  };

  const DeploymentIcon =
    deploymentTypeConfig[tool.deployment_type]?.icon || Server;

  return (
    <div className="space-y-6 relative">
      {/* 로딩 오버레이 - 삭제 중일 때 전체 화면 차단 */}
      {isDeleting && (
        <div className="fixed top-0 left-0 right-0 bottom-0 m-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-background rounded-lg border shadow-lg p-6 max-w-md mx-4">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">도구 제거 중</h3>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">{tool.name}</span>을(를)
                  제거하는 중입니다.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  이 작업은 약 1분 정도 소요될 수 있습니다.
                  <br />
                  잠시만 기다려주세요. 페이지를 닫지 마세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/studio/tools">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 cursor-pointer"
              disabled={isDeleting}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              도구 상세 정보
            </h1>
            <p className="text-muted-foreground">도구 ID: {tool.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/studio/tools/${tool.id}/edit`}>
            <Button className="cursor-pointer" disabled={isDeleting}>
              <Pencil className="h-4 w-4 mr-2" />
              수정
            </Button>
          </Link>
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
          >
            {isDeleting && (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                제거 중...
              </>
            )}
            {!isDeleting && (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                제거
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={(open) => {
          // 삭제 중일 때는 모달을 닫을 수 없도록 함
          if (!isDeleting) {
            setShowDeleteDialog(open);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              도구 삭제 {isDeleting ? "중" : "확인"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              <>
                정말 <span className="font-semibold">{tool.name}</span>을(를)
                삭제하시겠습니까?
                <br />
                <span className="text-destructive mt-2 block">
                  이 작업은 되돌릴 수 없습니다.
                </span>
                <span className="text-muted-foreground mt-2 block text-xs">
                  참고: 삭제 작업은 약 1분 정도 소요될 수 있습니다.
                </span>
              </>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2"
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isDeleting ? "삭제 중..." : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Unified Information Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              도구 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Basic Info Section */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Icon */}
              <div className="flex flex-col items-center gap-4">
                <div className="h-32 w-32 border-4 border-background shadow-lg rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                  {tool.icon_url && (
                    <Image
                      src={tool.icon_url}
                      alt={tool.name}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  )}
                  {!tool.icon_url && (
                    <Wrench className="h-16 w-16 text-primary" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Badge
                    className={`${
                      statusConfig[tool.status].color
                    } border justify-center`}
                  >
                    {statusConfig[tool.status].label}
                  </Badge>
                  <Badge
                    className={`${
                      providerConfig[tool.provider].color
                    } border justify-center`}
                  >
                    {providerConfig[tool.provider].label}
                  </Badge>
                </div>
              </div>

              {/* Tool Info Grid */}
              <div className="flex-1 grid gap-4 md:grid-cols-2">
                {/* Tool Name */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Wrench className="h-3.5 w-3.5" />
                    <span className="font-medium">도구 이름</span>
                  </div>
                  <p className="text-base font-semibold pl-5">{tool.name}</p>
                </div>

                {/* Definition Name */}
                {tool.definition_name && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Code2 className="h-3.5 w-3.5" />
                      <span className="font-medium">정의 이름</span>
                    </div>
                    <p className="text-base font-mono pl-5">
                      {tool.definition_name}
                    </p>
                  </div>
                )}

                {/* Tool ID */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Hash className="h-3.5 w-3.5" />
                    <span className="font-medium">도구 ID</span>
                  </div>
                  <p className="text-base font-semibold pl-5">#{tool.id}</p>
                </div>

                {/* Version */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <GitBranch className="h-3.5 w-3.5" />
                    <span className="font-medium">버전</span>
                  </div>
                  <p className="text-base font-mono font-semibold pl-5">
                    {tool.version}
                  </p>
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Package className="h-3.5 w-3.5" />
                    <span className="font-medium">카테고리</span>
                  </div>
                  <p className="text-base font-semibold pl-5">
                    {tool.category}
                  </p>
                </div>

                {/* Deployment Type */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <DeploymentIcon className="h-3.5 w-3.5" />
                    <span className="font-medium">배포 타입</span>
                  </div>
                  <p className="text-base font-semibold pl-5">
                    {deploymentTypeConfig[tool.deployment_type]?.label ||
                      tool.deployment_type}
                  </p>
                </div>

                {/* Description */}
                {tool.description && (
                  <div className="space-y-1 md:col-span-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FileCode className="h-3.5 w-3.5" />
                      <span className="font-medium">설명</span>
                    </div>
                    <p className="text-sm pl-5 text-muted-foreground leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Performance Metrics & Timeline & Tags Section */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Performance Metrics - Column 1 */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Activity className="h-4 w-4" />
                  성능 지표
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {/* Usage Count */}
                  <div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>사용 횟수</span>
                    </div>
                    <p className="text-base font-semibold">
                      {tool.usage_count?.toLocaleString() || 0}
                      <span className="text-xs font-normal text-muted-foreground ml-1">
                        회
                      </span>
                    </p>
                  </div>

                  {/* Success Rate */}
                  <div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Zap className="h-3.5 w-3.5" />
                      <span>성공률</span>
                    </div>
                    <p className="text-base font-semibold">
                      {tool.success_rate?.toFixed(1) || 0}
                      <span className="text-xs font-normal text-muted-foreground ml-1">
                        %
                      </span>
                    </p>
                  </div>

                  {/* Average Response Time */}
                  <div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>평균 응답 시간</span>
                    </div>
                    <p className="text-base font-semibold">
                      {tool.average_response_time?.toFixed(0) || 0}
                      <span className="text-xs font-normal text-muted-foreground ml-1">
                        ms
                      </span>
                    </p>
                  </div>

                  {/* Last Used At */}
                  <div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>마지막 사용</span>
                    </div>
                    <p className="text-base font-mono">
                      {tool.last_used_at
                        ? formatDate(tool.last_used_at)
                        : "사용 기록 없음"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline - Column 2 */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Clock className="h-4 w-4" />
                  타임라인
                </h3>
                <div className="space-y-3">
                  {/* Created At */}
                  <div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>생성일</span>
                    </div>
                    <p className="text-base font-mono">
                      {formatDate(tool.created_at)}
                    </p>
                  </div>

                  {/* Updated At */}
                  <div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>마지막 업데이트</span>
                    </div>
                    <p className="text-base font-mono">
                      {tool.updated_at ? formatDate(tool.updated_at) : "없음"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags and Keywords - Column 3 */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Tag className="h-4 w-4" />
                  태그 및 키워드
                </h3>
                <div className="space-y-3">
                  {tool.tags && tool.tags.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Tag className="h-3.5 w-3.5" />
                        <span>태그</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {tool.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {tool.keywords && tool.keywords.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Tag className="h-3.5 w-3.5" />
                        <span>키워드</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {tool.keywords.map((keyword, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-purple-50 text-purple-700 border-purple-200 text-xs"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Config Data Section */}
        {config && <ServerConfigCard config={config} toolId={tool.id} />}
      </div>
    </div>
  );
}

export default ToolPage;
