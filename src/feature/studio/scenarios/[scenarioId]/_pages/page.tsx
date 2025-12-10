"use client";

import { useState } from "react";
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
  User,
  Calendar,
  Shield,
  ArrowLeft,
  Pencil,
  Trash2,
  FileText,
  Tag,
  Settings,
  Workflow,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { formatDate } from "@/shared/utils/formatDate";
import { categoryConfig } from "../../_constants/categoryConfig";

import type { GetScenarioResponse } from "../../_api/getScenario";
import useDeleteScenario from "../_hooks/useDeleteScenario";
import { useRouter } from "next/navigation";

interface ScenarioPageProps {
  scenario: GetScenarioResponse;
}

function ScenarioPage({ scenario }: ScenarioPageProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { mutate: deleteScenario } = useDeleteScenario();

  const handleDelete = () => {
    setShowDeleteDialog(false);
    deleteScenario({ scenario_id: scenario.id });
    router.push("/studio/scenarios");
  };

  const categoryInfo = categoryConfig[scenario.category] || {
    label: scenario.category,
    color: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/studio/scenarios">
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
              시나리오 상세 정보
            </h1>
            <p className="text-muted-foreground">시나리오 ID: {scenario.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/studio/scenarios/${scenario.id}/edit`}>
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
            <AlertDialogTitle>시나리오 삭제 확인</AlertDialogTitle>
            <AlertDialogDescription>
              정말 <span className="font-semibold">{scenario.name}</span>
              을(를) 삭제하시겠습니까?
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
              <Workflow className="h-5 w-5" />
              시나리오 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Icon */}
              <div className="flex flex-col items-center gap-4">
                <div className="h-32 w-32 border-4 border-background shadow-lg rounded-2xl from-primary/20 to-primary/5 flex items-center justify-center">
                  <Workflow className="h-16 w-16 text-primary" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Badge className={`${categoryInfo.color} border`}>
                    {categoryInfo.label}
                  </Badge>
                </div>
              </div>

              {/* Scenario Info Grid */}
              <div className="flex-1 grid gap-4 md:grid-cols-2">
                {/* Name */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">이름</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">{scenario.name}</p>
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">설명</span>
                  </div>
                  <p className="text-sm pl-6 leading-relaxed">
                    {scenario.description}
                  </p>
                </div>

                {/* Definition Name */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    <span className="font-medium">정의 이름</span>
                  </div>
                  <p className="text-sm pl-6 leading-relaxed">
                    {scenario.definition_name}
                  </p>
                </div>

                {/* Scenario ID */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    <span className="font-medium">시나리오 ID</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">#{scenario.id}</p>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    <span className="font-medium">카테고리</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    {categoryInfo.label}
                  </p>
                </div>

                {/* User ID */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="font-medium">사용자 ID</span>
                  </div>
                  <p className="text-sm pl-6">{scenario.user_id}</p>
                </div>
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
                  {formatDate(scenario.created_at)}
                </p>
              </div>
            </div>

            {scenario.updated_at && (
              <>
                <Separator />
                {/* Updated At */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>마지막 업데이트</span>
                  </div>
                  <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                    <p className="text-sm font-mono">
                      {formatDate(scenario.updated_at)}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Additional Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              추가 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Type */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span>타입</span>
              </div>
              <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                {scenario.is_system && (
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-purple-100 text-purple-800 border-purple-200"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      템플릿
                    </Badge>
                  </div>
                )}
                {!scenario.is_system && (
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 border-green-200"
                    >
                      <User className="h-3 w-3 mr-1" />
                      사용자
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ScenarioPage;
