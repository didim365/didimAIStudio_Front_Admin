"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Box,
  Calendar,
  Clock,
  Database,
  Server,
  User,
  Activity,
  Cpu,
} from "lucide-react";
import JsonView from "@uiw/react-json-view";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { formatDate } from "@/shared/utils/formatDate";
import { GetConfigResponse } from "../_api/getConfig";

interface ModelPageProps {
  config: GetConfigResponse;
}

export default function ModelPage({ config }: ModelPageProps) {
  // Safe cast to access properties since the type might be opaque (Record<string, never>)
  const data = config as any;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/studio/data/models">
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
              모델 상세 정보
            </h1>
            <p className="text-muted-foreground">
              모델 ID: {data.user_model_id || data.id || "Unknown"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              기본 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Status/Icon Area */}
              <div className="flex flex-col items-center gap-4 min-w-[150px]">
                <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center border-4 border-background shadow-lg">
                  <Server className="h-16 w-16 text-muted-foreground" />
                </div>
                <Badge
                  variant={data.is_active ? "default" : "destructive"}
                  className="text-sm px-3 py-1"
                >
                  {data.is_active ? "활성화" : "비활성화"}
                </Badge>
              </div>

              {/* Info Grid */}
              <div className="flex-1 grid gap-4 md:grid-cols-2">
                {/* Model Name */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Box className="h-4 w-4" />
                    <span className="font-medium">모델명</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    {data.model_name || "N/A"}
                  </p>
                </div>

                {/* Provider */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Server className="h-4 w-4" />
                    <span className="font-medium">제공자</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    {data.provider || "N/A"}
                  </p>
                </div>

                {/* Deployment Type */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Activity className="h-4 w-4" />
                    <span className="font-medium">배포 타입</span>
                  </div>
                  <p className="text-lg font-semibold pl-6 capitalize">
                    {data.deployment_type?.replace(/_/g, " ") || "N/A"}
                  </p>
                </div>

                {/* User ID */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="font-medium">사용자 ID</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    {data.user_id || "N/A"}
                  </p>
                </div>

                {/* Created At */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">생성일</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    {formatDate(data.created_at)}
                  </p>
                </div>

                {/* Updated At */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">최근 수정일</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    {formatDate(data.updated_at)}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Full Config JSON View */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span>전체 설정 데이터</span>
              </div>
              <div className="ml-6 p-3 bg-muted/30 rounded-lg border border-border overflow-x-auto">
                <JsonView
                  value={data}
                  style={{
                    backgroundColor: "transparent",
                    fontSize: "0.875rem",
                  }}
                  displayDataTypes={false}
                  displayObjectSize={true}
                  enableClipboard={true}
                  collapsed={false}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
