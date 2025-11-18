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
  Link2,
  Code2,
  Settings,
  Container,
  Key,
  Layers,
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
import { GetMcpToolResponse } from "../api/getMcpTool";
import { useDeleteMcpTool } from "../hooks/useDeleteMcpTool";
import { GetMcpToolConfigResponse } from "../api/getMcpToolConfig";
import { ServerConfigCard } from "../components/ServerConfigCard";

// Config 데이터 타입 정의
export interface ConfigData {
  id: number;
  mcp_tool_id: number;
  server_config: Record<string, unknown>;
  has_secrets: boolean;
  env_keys: string[];
  capabilities: string[];
  config_schema_version: string;
  is_verified: boolean;
  last_verification_at?: string | null;
  verification_error?: string | null;
  created_at: string;
  updated_at: string;
}

function ToolPage({
  tool,
  config,
}: {
  tool: GetMcpToolResponse;
  config: GetMcpToolConfigResponse;
}) {
  // 타입 단언으로 config 타입 변환
  const configData = config as unknown as ConfigData;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // 도구 삭제 mutation
  const { mutate: deleteTool, isPending: isDeleting } = useDeleteMcpTool({
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
                  {tool.icon_url ? (
                    <Image
                      src={tool.icon_url}
                      alt={tool.name}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
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

                  {(!tool.tags || tool.tags.length === 0) &&
                    (!tool.keywords || tool.keywords.length === 0) && (
                      <p className="text-xs text-muted-foreground">
                        태그 및 키워드 없음
                      </p>
                    )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* URLs and Links Card */}
        {(tool.repo_url || tool.server_url) && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                링크 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {tool.repo_url && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                      <span>저장소 URL</span>
                    </div>
                    <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                      <a
                        href={tool.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-mono text-primary hover:underline break-all"
                      >
                        {tool.repo_url}
                      </a>
                    </div>
                  </div>
                  {tool.server_url && <Separator />}
                </>
              )}

              {tool.server_url && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <span>서버 URL</span>
                  </div>
                  <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                    <a
                      href={tool.server_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-mono text-primary hover:underline break-all"
                    >
                      {tool.server_url}
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Container Configuration Card */}
        {(tool.container_image ||
          tool.docker_compose_config ||
          tool.transport ||
          tool.server_type) && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Container className="h-5 w-5" />
                컨테이너 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {tool.container_image && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Container className="h-4 w-4 text-muted-foreground" />
                      <span>컨테이너 이미지</span>
                    </div>
                    <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                      <p className="text-sm font-mono break-all">
                        {tool.container_image}
                      </p>
                    </div>
                  </div>
                  {(tool.docker_compose_config ||
                    tool.transport ||
                    tool.server_type) && <Separator />}
                </>
              )}

              {tool.transport && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Layers className="h-4 w-4 text-muted-foreground" />
                      <span>전송 방식</span>
                    </div>
                    <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                      <p className="text-sm font-mono">{tool.transport}</p>
                    </div>
                  </div>
                  {(tool.docker_compose_config || tool.server_type) && (
                    <Separator />
                  )}
                </>
              )}

              {tool.server_type && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Server className="h-4 w-4 text-muted-foreground" />
                      <span>서버 타입</span>
                    </div>
                    <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                      <p className="text-sm font-mono">{tool.server_type}</p>
                    </div>
                  </div>
                  {tool.docker_compose_config && <Separator />}
                </>
              )}

              {tool.docker_compose_config && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span>Docker Compose 설정</span>
                  </div>
                  <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                    <pre className="text-xs font-mono overflow-x-auto">
                      {JSON.stringify(tool.docker_compose_config, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Environment Variables Card */}
        {tool.environment_variables &&
          Object.keys(tool.environment_variables).length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  환경 변수
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                  <div className="space-y-2">
                    {Object.entries(tool.environment_variables).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-start gap-2 text-sm"
                        >
                          <span className="font-mono font-semibold text-primary min-w-[150px]">
                            {key}:
                          </span>
                          <span className="font-mono text-muted-foreground break-all">
                            {value}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        {/* Config Data Section */}
        {config && configData && (
          <>
            {/* Server Configuration Card */}
            <ServerConfigCard config={configData} />

            {/* Environment Variables Keys Card */}
            {configData.env_keys && configData.env_keys.length > 0 && (
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-amber-600" />
                    환경 변수 키 목록
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    설정에서 사용되는 환경 변수 키들입니다
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {configData.env_keys.map((key, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-linear-to-r from-amber-50/50 to-yellow-50/50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-lg border border-amber-200/50 dark:border-amber-800/50 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center justify-center h-8 w-8 bg-amber-100 dark:bg-amber-900 rounded-md">
                          <Key className="h-4 w-4 text-amber-700 dark:text-amber-300" />
                        </div>
                        <span className="font-mono text-sm font-semibold text-amber-900 dark:text-amber-100">
                          {key}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Capabilities Card */}
            {configData.capabilities && configData.capabilities.length > 0 && (
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-600" />
                    지원 기능
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    이 도구가 제공하는 기능 목록입니다
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {configData.capabilities.map((capability, index) => (
                      <Badge
                        key={index}
                        className="bg-linear-to-r from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 border px-3 py-1.5 text-sm font-medium"
                      >
                        <Zap className="h-3 w-3 mr-1.5" />
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ToolPage;
