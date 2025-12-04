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
  Clock,
  Calendar,
  Code2,
  FileCode,
  GitBranch,
  Loader2,
  Rocket,
  StopCircle,
  Play,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { formatDate } from "@/shared/utils/formatDate";
import Image from "next/image";
import {
  statusConfig,
  providerConfig,
  deploymentTypeConfig,
} from "../../_constants/toolConfigs";
import { GetToolResponse } from "../_api/getTool";
import { useDeleteTool } from "../_hooks/useDeleteTool";
import { usePostDeployTool } from "../_hooks/usePostDeployTool";
import { usePostToolStop } from "../_hooks/usePostToolStop";
import { usePostToolStart } from "../_hooks/usePostToolStart";
import { GetToolConfigResponse } from "../_api/getToolConfig";
import { ServerConfigCard } from "../_components/ServerConfigCard";
import { ActionButton } from "../_components/ActionButton";

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
  const [showDeployDialog, setShowDeployDialog] = useState(false);
  const [showStopDialog, setShowStopDialog] = useState(false);
  const [showStartDialog, setShowStartDialog] = useState(false);
  console.log({ tool });
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

  // 도구 배포 mutation
  const { mutate: deployTool, isPending: isDeploying } = usePostDeployTool({
    onSuccess: () => {
      // 도구 상세 정보 쿼리 무효화하여 최신 상태 가져오기
      queryClient.invalidateQueries({
        queryKey: ["mcp-tools", tool.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["mcp-tools"],
      });
      setShowDeployDialog(false);
    },
    meta: {
      successMessage: "도구 배포가 시작되었습니다.",
    },
  });

  // 도구 시작 mutation
  const { mutate: startTool, isPending: isStarting } = usePostToolStart({
    onSuccess: () => {
      // 도구 상세 정보 쿼리 무효화하여 최신 상태 가져오기
      queryClient.invalidateQueries({
        queryKey: ["mcp-tools", tool.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["mcp-tools"],
      });
      setShowStartDialog(false);
    },
    meta: {
      successMessage: "도구 시작이 시작되었습니다.",
    },
  });

  // 도구 중지 mutation
  const { mutate: stopTool, isPending: isStopping } = usePostToolStop({
    onSuccess: () => {
      // 도구 상세 정보 쿼리 무효화하여 최신 상태 가져오기
      queryClient.invalidateQueries({
        queryKey: ["mcp-tools", tool.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["mcp-tools"],
      });
      setShowStopDialog(false);
    },
    meta: {
      successMessage: "도구 중지가 시작되었습니다.",
    },
  });

  const handleDelete = () => {
    deleteTool({ tool_id: tool.id });
  };

  const handleDeploy = () => {
    deployTool({
      params: { tool_id: tool.id },
      data: {
        timeout_seconds: 300,
        force_restart: false,
      },
    });
  };

  const handleStart = () => {
    startTool({
      params: { tool_id: tool.id },
      data: {
        health_check_timeout: 60,
      },
    });
  };

  const handleStop = () => {
    stopTool({
      params: { tool_id: tool.id },
      data: {
        graceful: true,
        timeout_seconds: 30,
      },
    });
  };

  const isActionDisabled =
    isDeleting || isDeploying || isStopping || isStarting;

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
              disabled={isDeleting || isStopping || isStarting}
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
          <ActionButton
            onClick={() => setShowDeployDialog(true)}
            disabled={isActionDisabled}
            isLoading={isDeploying}
            icon={Rocket}
            label="배포"
            loadingLabel="배포 중..."
            className="from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          />
          <ActionButton
            onClick={() => setShowStartDialog(true)}
            disabled={isActionDisabled}
            isLoading={isStarting}
            icon={Play}
            label="시작"
            loadingLabel="시작 중..."
            className="from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          />
          <ActionButton
            onClick={() => setShowStopDialog(true)}
            disabled={isActionDisabled}
            isLoading={isStopping}
            icon={StopCircle}
            label="중지"
            loadingLabel="중지 중..."
            className="from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
          />
          <Link href={`/studio/tools/${tool.id}/edit`}>
            <Button className="cursor-pointer" disabled={isActionDisabled}>
              <Pencil className="h-4 w-4 mr-2" />
              수정
            </Button>
          </Link>
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isActionDisabled}
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

      {/* Start Confirmation Dialog */}
      <AlertDialog
        open={showStartDialog}
        onOpenChange={(open) => {
          // 시작 중일 때는 모달을 닫을 수 없도록 함
          if (!isStarting) {
            setShowStartDialog(open);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-green-600" />
              도구 시작 {isStarting ? "중" : "확인"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              <>
                <span className="font-semibold">{tool.name}</span>을(를)
                시작하시겠습니까?
                <br />
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-600 mt-1.5 shrink-0" />
                    <span className="text-muted-foreground">
                      배포 타입:
                      <span className="font-medium text-foreground">
                        {deploymentTypeConfig[tool.deployment_type]?.label ||
                          tool.deployment_type}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-600 mt-1.5 shrink-0" />
                    <span className="text-muted-foreground">
                      현재 상태:
                      <span className="font-medium text-foreground">
                        {statusConfig[tool.status].label}
                      </span>
                    </span>
                  </div>
                </div>
                <span className="text-muted-foreground mt-4 block text-xs">
                  참고: 시작 작업은 비동기로 처리되며, 완료까지 시간이 걸릴 수
                  있습니다.
                </span>
              </>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isStarting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleStart}
              disabled={isStarting}
              className="flex items-center gap-2 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              {isStarting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isStarting ? "시작 중..." : "시작"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deploy Confirmation Dialog */}
      <AlertDialog
        open={showDeployDialog}
        onOpenChange={(open) => {
          // 배포 중일 때는 모달을 닫을 수 없도록 함
          if (!isDeploying) {
            setShowDeployDialog(open);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-blue-600" />
              도구 배포 {isDeploying ? "중" : "확인"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              <>
                <span className="font-semibold">{tool.name}</span>을(를)
                배포하시겠습니까?
                <br />
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <span className="text-muted-foreground">
                      배포 타입:
                      <span className="font-medium text-foreground">
                        {deploymentTypeConfig[tool.deployment_type]?.label ||
                          tool.deployment_type}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <span className="text-muted-foreground">
                      현재 상태:
                      <span className="font-medium text-foreground">
                        {statusConfig[tool.status].label}
                      </span>
                    </span>
                  </div>
                </div>
                <span className="text-muted-foreground mt-4 block text-xs">
                  참고: 배포 작업은 비동기로 처리되며, 완료까지 시간이 걸릴 수
                  있습니다.
                </span>
              </>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeploying}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeploy}
              disabled={isDeploying}
              className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {isDeploying && <Loader2 className="h-4 w-4 animate-spin" />}
              {isDeploying ? "배포 중..." : "배포 시작"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Stop Confirmation Dialog */}
      <AlertDialog
        open={showStopDialog}
        onOpenChange={(open) => {
          // 중지 중일 때는 모달을 닫을 수 없도록 함
          if (!isStopping) {
            setShowStopDialog(open);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <StopCircle className="h-5 w-5 text-orange-600" />
              도구 중지 {isStopping ? "중" : "확인"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              <>
                <span className="font-semibold">{tool.name}</span>을(를)
                중지하시겠습니까?
                <br />
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-600 mt-1.5 shrink-0" />
                    <span className="text-muted-foreground">
                      배포 타입:
                      <span className="font-medium text-foreground">
                        {deploymentTypeConfig[tool.deployment_type]?.label ||
                          tool.deployment_type}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-600 mt-1.5 shrink-0" />
                    <span className="text-muted-foreground">
                      현재 상태:
                      <span className="font-medium text-foreground">
                        {statusConfig[tool.status].label}
                      </span>
                    </span>
                  </div>
                </div>
                <span className="text-muted-foreground mt-4 block text-xs">
                  참고: 중지 작업은 비동기로 처리되며, 완료까지 시간이 걸릴 수
                  있습니다.
                </span>
              </>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isStopping}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleStop}
              disabled={isStopping}
              className="flex items-center gap-2 bg-linear-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
            >
              {isStopping && <Loader2 className="h-4 w-4 animate-spin" />}
              {isStopping ? "중지 중..." : "중지 시작"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
            <div className="grid gap-6 md:grid-cols-2">
              {/* Timeline - Column 1 */}
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

              {/* Tags and Keywords - Column 2 */}
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
