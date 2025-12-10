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
  Lock,
  Unlock,
  ArrowLeft,
  Pencil,
  Trash2,
  UserCircle,
  FileText,
  Tag,
  Settings,
  Sparkles,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { formatDate } from "@/shared/utils/formatDate";
import { categoryConfig } from "../../_constants/categoryConfig";

import type { GetPersonaResponse } from "../_api/getPersona";
import useDeletePersona from "../_hooks/useDeletePersona";
import { useRouter } from "next/navigation";

interface PersonaPageProps {
  persona: GetPersonaResponse;
}

function PersonaPage({ persona }: PersonaPageProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { mutate: deletePersona } = useDeletePersona();

  const handleDelete = () => {
    setShowDeleteDialog(false);
    deletePersona({ persona_id: persona.id });
    router.push("/studio/templates/personas");
  };

  const categoryInfo = categoryConfig[persona.category] || {
    label: persona.category,
    color: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/studio/templates/personas">
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
              페르소나 상세 정보
            </h1>
            <p className="text-muted-foreground">페르소나 ID: {persona.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/studio/templates/personas/${persona.id}/edit`}>
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
            <AlertDialogTitle>페르소나 삭제 확인</AlertDialogTitle>
            <AlertDialogDescription>
              정말 <span className="font-semibold">{persona.name}</span>
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
              <UserCircle className="h-5 w-5" />
              페르소나 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Persona Info Grid */}
              <div className="flex-1 grid gap-4 md:grid-cols-2">
                {/* Title */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">제목</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">{persona.name}</p>
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">설명</span>
                  </div>
                  <p className="text-sm pl-6 leading-relaxed">
                    {persona.description}
                  </p>
                </div>

                {/* Persona ID */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    <span className="font-medium">페르소나 ID</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">#{persona.id}</p>
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Prompt Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              시스템 프롬프트
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span className="font-medium">AI 모델에 전달되는 프롬프트</span>
              </div>
              <div className="ml-6 p-4 bg-muted rounded-lg border border-border">
                <pre className="text-sm font-mono whitespace-pre-wrap wrap-break-word">
                  {persona.system_prompt}
                </pre>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                이 프롬프트는 AI 모델의 동작을 정의하는 핵심 설정입니다.
              </p>
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
                  {formatDate(persona.created_at)}
                </p>
              </div>
            </div>

            {persona.updated_at && (
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
                      {formatDate(persona.updated_at)}
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
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-purple-100 text-purple-800 border-purple-200"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    시스템 페르소나
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Public Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                {persona.is_public && (
                  <Unlock className="h-4 w-4 text-muted-foreground" />
                )}
                {!persona.is_public && (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                )}
                <span>공개 설정</span>
              </div>
              <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                {persona.is_public && (
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-teal-100 text-teal-800 border-teal-200"
                    >
                      <Unlock className="h-3 w-3 mr-1" />
                      공개
                    </Badge>
                  </div>
                )}
                {!persona.is_public && (
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-orange-100 text-orange-800 border-orange-200"
                    >
                      <Lock className="h-3 w-3 mr-1" />
                      비공개
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

export default PersonaPage;
