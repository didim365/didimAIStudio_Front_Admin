"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetMcpTool } from "../hooks/useGetMcpTool";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
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
  Database,
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
  Globe,
  Key,
  Layers,
  FileCode,
  GitBranch,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { formatDate } from "@/shared/utils/formatDate";
import Image from "next/image";
import { statusConfig, providerConfig } from "../constants/toolConfigs";

interface ToolPageProps {
  toolId: string;
}

const deploymentTypeConfig = {
  LOCAL: { label: "로컬", icon: Server },
  CONTAINER: { label: "컨테이너", icon: Container },
  CLOUD: { label: "클라우드", icon: Globe },
  SERVERLESS: { label: "서버리스", icon: Zap },
};

function ToolPage({ toolId }: ToolPageProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { data: tool, isLoading, error } = useGetMcpTool(Number(toolId));

  const handleDelete = () => {
    // TODO: 도구 삭제 API 호출
    console.log("도구 삭제:", toolId);
    setShowDeleteDialog(false);
    // TODO: 삭제 후 도구 목록 페이지로 이동
    router.push("/studio/tools");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 px-4">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">오류 발생</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              도구 정보를 불러오는 중 오류가 발생했습니다.
            </p>
            <p className="text-sm text-destructive mt-2">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="py-8 px-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              도구를 찾을 수 없습니다.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const DeploymentIcon =
    deploymentTypeConfig[tool.deployment_type]?.icon || Server;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/studio/tools">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 cursor-pointer"
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
          <Link href={`/studio/tools/${toolId}/edit`}>
            <Button className="cursor-pointer">
              <Pencil className="h-4 w-4 mr-2" />
              수정
            </Button>
          </Link>
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            제거
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>도구 삭제 확인</AlertDialogTitle>
            <AlertDialogDescription>
              정말 <span className="font-semibold">{tool.name}</span>을(를)
              삭제하시겠습니까?
              <br />
              <span className="text-destructive mt-2 block">
                이 작업은 되돌릴 수 없습니다.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              기본 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Wrench className="h-4 w-4" />
                    <span className="font-medium">도구 이름</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">{tool.name}</p>
                </div>

                {/* Definition Name */}
                {tool.definition_name && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Code2 className="h-4 w-4" />
                      <span className="font-medium">정의 이름</span>
                    </div>
                    <p className="text-lg font-mono pl-6">
                      {tool.definition_name}
                    </p>
                  </div>
                )}

                {/* Tool ID */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    <span className="font-medium">도구 ID</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">#{tool.id}</p>
                </div>

                {/* Version */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GitBranch className="h-4 w-4" />
                    <span className="font-medium">버전</span>
                  </div>
                  <p className="text-lg font-mono font-semibold pl-6">
                    {tool.version}
                  </p>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span className="font-medium">카테고리</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">{tool.category}</p>
                </div>

                {/* Deployment Type */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DeploymentIcon className="h-4 w-4" />
                    <span className="font-medium">배포 타입</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    {deploymentTypeConfig[tool.deployment_type]?.label ||
                      tool.deployment_type}
                  </p>
                </div>

                {/* Description */}
                {tool.description && (
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileCode className="h-4 w-4" />
                      <span className="font-medium">설명</span>
                    </div>
                    <p className="text-base pl-6 text-muted-foreground leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              성능 지표
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Usage Count */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span>사용 횟수</span>
              </div>
              <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                <p className="text-2xl font-bold">
                  {tool.usage_count?.toLocaleString() || 0}
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    회
                  </span>
                </p>
              </div>
            </div>

            <Separator />

            {/* Success Rate */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <span>성공률</span>
              </div>
              <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                <p className="text-2xl font-bold">
                  {tool.success_rate?.toFixed(1) || 0}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    %
                  </span>
                </p>
              </div>
            </div>

            <Separator />

            {/* Average Response Time */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>평균 응답 시간</span>
              </div>
              <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                <p className="text-2xl font-bold">
                  {tool.average_response_time?.toFixed(0) || 0}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    ms
                  </span>
                </p>
              </div>
            </div>

            <Separator />

            {/* Last Used At */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>마지막 사용</span>
              </div>
              <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                <p className="text-sm font-mono">
                  {tool.last_used_at
                    ? formatDate(tool.last_used_at)
                    : "사용 기록 없음"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              타임라인
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Created At */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>생성일</span>
              </div>
              <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                <p className="text-sm font-mono">
                  {formatDate(tool.created_at)}
                </p>
              </div>
            </div>

            <Separator />

            {/* Updated At */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>마지막 업데이트</span>
              </div>
              <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                <p className="text-sm font-mono">
                  {tool.updated_at ? formatDate(tool.updated_at) : "없음"}
                </p>
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

        {/* Tags and Keywords Card */}
        {((tool.tags && tool.tags.length > 0) ||
          (tool.keywords && tool.keywords.length > 0)) && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                태그 및 키워드
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {tool.tags && tool.tags.length > 0 && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span>태그</span>
                    </div>
                    <div className="ml-6 flex flex-wrap gap-2">
                      {tool.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {tool.keywords && tool.keywords.length > 0 && <Separator />}
                </>
              )}

              {tool.keywords && tool.keywords.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span>키워드</span>
                  </div>
                  <div className="ml-6 flex flex-wrap gap-2">
                    {tool.keywords.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-purple-50 text-purple-700 border-purple-200"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Advanced Configuration Card */}
        {(tool.resource_requirements ||
          tool.default_config ||
          tool.metadata) && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                고급 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {tool.resource_requirements && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span>리소스 요구사항</span>
                    </div>
                    <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                      <pre className="text-xs font-mono overflow-x-auto">
                        {JSON.stringify(tool.resource_requirements, null, 2)}
                      </pre>
                    </div>
                  </div>
                  {(tool.default_config || tool.metadata) && <Separator />}
                </>
              )}

              {tool.default_config && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span>기본 설정</span>
                    </div>
                    <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                      <pre className="text-xs font-mono overflow-x-auto">
                        {JSON.stringify(tool.default_config, null, 2)}
                      </pre>
                    </div>
                  </div>
                  {tool.metadata && <Separator />}
                </>
              )}

              {tool.metadata && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <FileCode className="h-4 w-4 text-muted-foreground" />
                    <span>메타데이터</span>
                  </div>
                  <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                    <pre className="text-xs font-mono overflow-x-auto">
                      {JSON.stringify(tool.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default ToolPage;
