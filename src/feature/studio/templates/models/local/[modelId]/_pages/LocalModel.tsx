"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Label } from "@/shared/ui/label";
import {
  ArrowLeft,
  Server,
  Hash,
  FileText,
  Cpu,
  Clock,
  Calendar,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { paths } from "@/shared/types/api/models";
import { DeploymentStatusBadge } from "../_components/DeploymentStatusBadge";
import { formatDate } from "@/shared/utils/formatDate";

type LocalModelType =
  paths["/v1/admin/models/local/{model_id}"]["get"]["responses"]["200"]["content"]["application/json"];

interface LocalModelDetailPageProps {
  model: LocalModelType;
}

function LocalModelPage({ model }: LocalModelDetailPageProps) {
  return (
    <div className="py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/studio/templates/models/local">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              로컬 LLM 상세
            </h1>
            <p className="text-muted-foreground mt-1">
              로컬에 배포된 모델의 상세 정보를 확인하세요
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6">
        {/* 기본 정보 Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              기본 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* 모델 ID */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Hash className="h-4 w-4" />
                  모델 ID
                </Label>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-muted px-3 py-2 rounded">
                    {model.model_id}
                  </code>
                </div>
              </div>

              {/* GPUStack 모델 ID */}
              {model.gpustack_model_id && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Server className="h-4 w-4" />
                    GPUStack 모델 ID
                  </Label>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-muted px-3 py-2 rounded">
                      {model.gpustack_model_id}
                    </code>
                  </div>
                </div>
              )}

              {/* 모델명 */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  모델명
                </Label>
                <p className="text-base font-medium">{model.model_name}</p>
              </div>

              {/* 배포 상태 */}
              {model.deployment_status && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Server className="h-4 w-4" />
                    배포 상태
                  </Label>
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
                </div>
              )}

              {/* 제공자 */}
              {model.provider && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Server className="h-4 w-4" />
                    제공자
                  </Label>
                  <Badge variant="outline" className="w-fit">
                    {model.provider}
                  </Badge>
                </div>
              )}

              {/* 배포 타입 */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Server className="h-4 w-4" />
                  배포 타입
                </Label>
                <Badge variant="outline" className="w-fit">
                  {model.deployment_type}
                </Badge>
              </div>

              {/* 백엔드 */}
              {model.backend && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Cpu className="h-4 w-4" />
                    백엔드
                  </Label>
                  <p className="text-base">{model.backend}</p>
                </div>
              )}

              {/* 양자화 */}
              {model.quantization && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Cpu className="h-4 w-4" />
                    양자화
                  </Label>
                  <Badge variant="outline" className="w-fit">
                    {model.quantization}
                  </Badge>
                </div>
              )}

              {/* API 엔드포인트 */}
              {model.api_endpoint && (
                <div className="space-y-2 md:col-span-2">
                  <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <LinkIcon className="h-4 w-4" />
                    API 엔드포인트
                  </Label>
                  <code className="text-sm bg-muted px-3 py-2 rounded block">
                    {model.api_endpoint}
                  </code>
                </div>
              )}

              {/* 모델 경로 */}
              {model.model_path && (
                <div className="space-y-2 md:col-span-2">
                  <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    모델 경로
                  </Label>
                  <code className="text-sm bg-muted px-3 py-2 rounded block break-all">
                    {model.model_path}
                  </code>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 설정 정보 Card */}
        {model.settings && Object.keys(model.settings).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                사용자 설정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(model.settings).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      {key}
                    </Label>
                    <p className="text-base">{String(value)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 메타 정보 Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              메타 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* 생성 시간 */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  생성 시간
                </Label>
                <p className="text-base">{formatDate(model.created_at)}</p>
              </div>

              {/* 수정 시간 */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  수정 시간
                </Label>
                <p className="text-base">{formatDate(model.updated_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default LocalModelPage;
