"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
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
  Settings,
  Container,
  Server,
  Key,
  Calendar,
  ArrowLeft,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Activity,
  User,
  Wrench,
  Code,
  Shield,
  Layers,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { formatDate } from "@/shared/utils/formatDate";
import { GetUserConfigResponse } from "../_api/getUserConfig";
import JsonView from "@uiw/react-json-view";
import { STATUS_CONFIG } from "../../_constants/containerConfigs";
import { cn } from "@/shared/lib/utils";
import { useDeleteUserConfig } from "../_hooks/useDeleteUserConfig";

interface ToolPageProps {
  config: GetUserConfigResponse;
}

function ToolPage({ config }: ToolPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // 사용자 설정 삭제 mutation
  const { mutate: deleteUserConfig, isPending: isDeleting } =
    useDeleteUserConfig({
      onSuccess: () => {
        // 사용자 설정 목록 쿼리 무효화
        queryClient.invalidateQueries({
          queryKey: ["user-configs"],
        });
        setShowDeleteDialog(false);
        router.push("/studio/data/tools");
      },
      meta: {
        successMessage: "설정이 성공적으로 삭제되었습니다.",
      },
    });

  const handleDelete = () => {
    deleteUserConfig({ config_id: config.config_id });
  };

  const statusConfig =
    config.container_status && STATUS_CONFIG[config.container_status]
      ? STATUS_CONFIG[config.container_status]
      : {
          label: config.container_status || "알 수 없음",
          variant: "secondary" as const,
          icon: <Activity className="h-3 w-3" />,
          className: "bg-slate-50 text-slate-700 border-slate-200",
        };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/studio/data/tools">
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
              도구 설정 상세 정보
            </h1>
            <p className="text-muted-foreground">
              설정 ID: {config.config_id} | 도구 ID: {config.tool_id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/studio/data/tools/${config.config_id}/edit`}>
            <Button className="cursor-pointer">
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
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? "삭제 중..." : "제거"}
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>설정 삭제 확인</AlertDialogTitle>
            <AlertDialogDescription>
              정말
              <span className="font-semibold">{config.config_name}</span>
              설정을 삭제하시겠습니까?
              <br />
              <span className="text-destructive mt-2 block">
                이 작업은 되돌릴 수 없습니다.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "삭제 중..." : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Info Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              기본 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Config Name */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Wrench className="h-4 w-4" />
                  <span className="font-medium">설정 이름</span>
                </div>
                <p className="text-lg font-semibold pl-6">
                  {config.config_name || "정보 없음"}
                </p>
              </div>

              {/* User ID */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="font-medium">사용자 ID</span>
                </div>
                <p className="text-lg font-semibold pl-6 break-all">
                  {config.user_id}
                </p>
              </div>

              {/* Tool ID */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Wrench className="h-4 w-4" />
                  <span className="font-medium">도구 ID</span>
                </div>
                <p className="text-lg font-semibold pl-6">{config.tool_id}</p>
              </div>

              {/* Tool Name */}
              {config.tool_name && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Wrench className="h-4 w-4" />
                    <span className="font-medium">도구 이름</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    {config.tool_name}
                  </p>
                </div>
              )}

              {/* Status Badges */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="h-4 w-4" />
                  <span className="font-medium">상태</span>
                </div>
                <div className="pl-6 flex flex-wrap gap-2">
                  {config.container_status && (
                    <Badge
                      variant={statusConfig.variant}
                      className={cn(
                        "flex items-center gap-1",
                        statusConfig.className
                      )}
                    >
                      {statusConfig.icon}
                      {statusConfig.label}
                    </Badge>
                  )}
                  <Badge
                    variant={config.is_active ? "default" : "secondary"}
                    className="flex items-center gap-1"
                  >
                    {config.is_active ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    {config.is_active ? "활성" : "비활성"}
                  </Badge>
                  <Badge
                    variant={config.has_secrets ? "default" : "outline"}
                    className="flex items-center gap-1"
                  >
                    {config.has_secrets ? (
                      <Key className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    {config.has_secrets ? "민감정보 있음" : "민감정보 없음"}
                  </Badge>
                </div>
              </div>

              {/* Created At */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">생성일</span>
                </div>
                <p className="text-lg font-semibold pl-6">
                  {formatDate(config.created_at)}
                </p>
              </div>

              {/* Updated At */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">마지막 업데이트</span>
                </div>
                <p className="text-lg font-semibold pl-6">
                  {formatDate(config.updated_at)}
                </p>
              </div>

              {/* Config Schema Version */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Settings className="h-4 w-4" />
                  <span className="font-medium">스키마 버전</span>
                </div>
                <p className="text-lg font-semibold pl-6">
                  {config.config_schema_version}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Container Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Container className="h-5 w-5" />
              컨테이너 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Container Status */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="h-4 w-4" />
                  <span className="font-medium">컨테이너 상태</span>
                </div>
                <div className="pl-6">
                  {config.container_status ? (
                    <Badge
                      variant={statusConfig.variant}
                      className={cn(
                        "flex items-center gap-1 w-fit",
                        statusConfig.className
                      )}
                    >
                      {statusConfig.icon}
                      {statusConfig.label}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      정보 없음
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Server Config Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              서버 설정
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Server className="h-4 w-4 text-muted-foreground" />
                <span>서버 설정 정보</span>
              </div>
              <div className="ml-6 p-3 bg-muted rounded-lg border border-border overflow-x-auto">
                {config.server_config &&
                Object.keys(config.server_config).length > 0 ? (
                  <JsonView
                    value={config.server_config}
                    style={{
                      backgroundColor: "transparent",
                      fontSize: "0.875rem",
                    }}
                    displayDataTypes={false}
                    displayObjectSize={false}
                    enableClipboard={true}
                    collapsed={false}
                  />
                ) : (
                  <span className="text-sm text-muted-foreground">없음</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Environment Keys Card */}
        {config.env_keys && config.env_keys.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                환경 변수 키
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-3">
                  이 설정에서 사용되는 환경 변수 키 목록입니다.
                </p>
                <div className="flex flex-wrap gap-2">
                  {config.env_keys.map((key, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="font-mono text-xs"
                    >
                      {key}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Capabilities Card */}
        {config.capabilities && config.capabilities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                지원 기능
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-3">
                  이 도구가 지원하는 기능 목록입니다.
                </p>
                <div className="flex flex-wrap gap-2">
                  {config.capabilities.map((capability, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      {capability}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Masked Secrets Card */}
        {config.masked_secrets &&
          Object.keys(config.masked_secrets).length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  민감 정보 (마스킹)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      보안을 위해 마스킹 처리된 민감 정보입니다.
                    </span>
                  </div>
                  <div className="p-3 bg-muted rounded-lg border border-border overflow-x-auto">
                    <JsonView
                      value={config.masked_secrets}
                      style={{
                        backgroundColor: "transparent",
                        fontSize: "0.875rem",
                      }}
                      displayDataTypes={false}
                      displayObjectSize={false}
                      enableClipboard={false}
                      collapsed={false}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  );
}

export default ToolPage;
