"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
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
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import {
  ArrowLeft,
  Server,
  Hash,
  FileText,
  Cpu,
  Calendar,
  Link as LinkIcon,
  ExternalLink,
  Package,
  Database,
  Settings,
  Zap,
  Layers,
  Trash2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { paths } from "@/shared/types/api/models";
import { DeploymentStatusBadge } from "../_components/DeploymentStatusBadge";
import { formatDate } from "@/shared/utils/formatDate";
import { useDeleteModel } from "../_hooks/useDeleteModel";
import { useState } from "react";

type LocalModelType =
  paths["/v1/admin/models/local/{model_id}"]["get"]["responses"]["200"]["content"]["application/json"];

interface LocalModelDetailPageProps {
  model: LocalModelType;
}

function LocalModelPage({ model }: LocalModelDetailPageProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { mutate: deleteModel, isPending: isDeleting } = useDeleteModel({
    onSuccess: () => {
      router.push("/studio/templates/models/local");
    },
    meta: {
      successMessage: "모델이 성공적으로 삭제되었습니다.",
    },
  });

  const handleDelete = () => {
    deleteModel({ model_id: model.model_id });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/studio/templates/models/local">
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
              로컬 모델 상세 정보
            </h1>
            <p className="text-muted-foreground">모델 ID: {model.model_id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {model.api_endpoint && (
            <Button
              type="button"
              variant="default"
              className="gap-2 shrink-0"
              asChild
            >
              <a
                href={model.api_endpoint}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                API 엔드포인트 열기
              </a>
            </Button>
          )}
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="gap-2 shrink-0"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    삭제 중...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    모델 삭제
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>모델을 삭제하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  이 작업은 되돌릴 수 없습니다. 모델 &quot;{model.model_name}
                  &quot;이(가) GPUStack과 데이터베이스에서 영구적으로
                  삭제됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  취소
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      삭제 중...
                    </>
                  ) : (
                    "삭제"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Model Information Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              모델 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Icon and Status */}
              <div className="flex flex-col items-center gap-4">
                <div className="h-32 w-32 border-4 border-background shadow-lg rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Server className="h-16 w-16 text-primary" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  {model.deployment_status && (
                    <DeploymentStatusBadge
                      status={
                        model.deployment_status as
                          | "pending"
                          | "running"
                          | "stopped"
                          | "failed"
                          | "unknown"
                      }
                    />
                  )}
                  <Badge variant="secondary" className="gap-1.5">
                    <Package className="h-3 w-3" />
                    {model.deployment_type}
                  </Badge>
                </div>
              </div>

              {/* Model Info Grid */}
              <div className="flex-1 grid gap-4 md:grid-cols-2">
                {/* Model Name */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">모델명</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    {model.model_name}
                  </p>
                </div>

                {/* Model ID */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    <span className="font-medium">모델 ID</span>
                  </div>
                  <code className="text-sm font-mono pl-6 block">
                    {model.model_id}
                  </code>
                </div>

                {/* GPUStack Model ID */}
                {model.gpustack_model_id && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Server className="h-4 w-4" />
                      <span className="font-medium">GPUStack 모델 ID</span>
                    </div>
                    <code className="text-sm font-mono pl-6 block">
                      {model.gpustack_model_id}
                    </code>
                  </div>
                )}

                {/* Provider */}
                {model.provider && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Server className="h-4 w-4" />
                      <span className="font-medium">제공자</span>
                    </div>
                    <p className="text-lg font-semibold pl-6">
                      {model.provider}
                    </p>
                  </div>
                )}

                {/* Backend */}
                {model.backend && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Cpu className="h-4 w-4" />
                      <span className="font-medium">백엔드</span>
                    </div>
                    <div className="pl-6">
                      <Badge variant="outline" className="gap-1.5">
                        <Cpu className="h-3 w-3" />
                        {model.backend}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Quantization */}
                {model.quantization && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Zap className="h-4 w-4" />
                      <span className="font-medium">양자화</span>
                    </div>
                    <div className="pl-6">
                      <Badge variant="outline" className="gap-1.5">
                        <Zap className="h-3 w-3" />
                        {model.quantization}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* API Endpoint */}
                {model.api_endpoint && (
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <LinkIcon className="h-4 w-4" />
                      <span className="font-medium">API 엔드포인트</span>
                    </div>
                    <code className="text-xs bg-muted px-3 py-2 rounded font-mono break-all block ml-6">
                      {model.api_endpoint}
                    </code>
                  </div>
                )}

                {/* Model Path */}
                {model.model_path && (
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">모델 경로</span>
                    </div>
                    <code className="text-xs bg-muted px-3 py-2 rounded font-mono break-all block ml-6">
                      {model.model_path}
                    </code>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              활동 정보
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
                  {formatDate(model.created_at)}
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
                  {formatDate(model.updated_at)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deployment Configuration Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              배포 구성
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Deployment Type */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span>배포 타입</span>
              </div>
              <div className="ml-6">
                <Badge variant="secondary" className="gap-1.5">
                  <Package className="h-3 w-3" />
                  {model.deployment_type}
                </Badge>
              </div>
            </div>

            {model.backend && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                    <span>백엔드</span>
                  </div>
                  <p className="ml-6 text-base font-semibold">
                    {model.backend}
                  </p>
                </div>
              </>
            )}

            {model.quantization && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span>양자화</span>
                  </div>
                  <div className="ml-6">
                    <Badge variant="outline" className="gap-1.5">
                      <Zap className="h-3 w-3" />
                      {model.quantization}
                    </Badge>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* User Settings Card */}
        {model.settings && Object.keys(model.settings).length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                사용자 설정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(model.settings).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Settings className="h-4 w-4" />
                      <span className="font-medium">{key}</span>
                    </div>
                    <p className="text-base font-semibold pl-6">
                      {String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default LocalModelPage;
