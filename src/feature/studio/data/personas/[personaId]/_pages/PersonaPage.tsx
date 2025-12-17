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
  UserCircle,
  FileText,
  Tag,
  Settings,
  Sparkles,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { formatDate } from "@/shared/utils/formatDate";

import type { GetMyPersonaResponse } from "../_api/getMyPersona";
import useDeletePersona from "../_hooks/useDeletePersona";
import { useRouter } from "next/navigation";

interface PersonaPageProps {
  myPersona: GetMyPersonaResponse;
}

function PersonaPage({ myPersona }: PersonaPageProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { mutate: deletePersona } = useDeletePersona();

  const handleDelete = () => {
    setShowDeleteDialog(false);
    deletePersona({ persona_id: myPersona.persona_data_id });
    router.push("/studio/data/personas");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/studio/data/personas">
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
            <p className="text-muted-foreground">페르소나 ID: {myPersona.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/studio/data/personas/${myPersona.id}/edit`}>
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
              정말{" "}
              <span className="font-semibold">
                {myPersona.user_my_persona_title || `페르소나 #${myPersona.id}`}
              </span>
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
                  <p className="text-lg font-semibold pl-6">
                    {myPersona.user_my_persona_title ||
                      `페르소나 #${myPersona.id}`}
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">설명</span>
                  </div>
                  <p className="text-sm pl-6 leading-relaxed">
                    {myPersona.user_my_persona_description ||
                      "설명이 없습니다."}
                  </p>
                </div>

                {/* Persona ID */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    <span className="font-medium">마이페이지 ID</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">#{myPersona.id}</p>
                </div>

                {/* Persona Data ID */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    <span className="font-medium">원본 페르소나 데이터 ID</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    #{myPersona.persona_data_id}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connections Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              연결 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <span className="font-medium">연결된 시나리오</span>
                </div>
                <Badge variant="outline">{myPersona.count_scenario}개</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <span className="font-medium">연결된 에이전트</span>
                </div>
                <Badge variant="outline">{myPersona.count_agent}개</Badge>
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
                  {formatDate(myPersona.created_at)}
                </p>
              </div>
            </div>

            {myPersona.updated_at && (
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
                      {formatDate(myPersona.updated_at)}
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
            {/* Favorite Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span>즐겨찾기</span>
              </div>
              <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  {myPersona.is_favorite ? (
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800 border-yellow-200"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      즐겨찾기
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-gray-100 text-gray-800 border-gray-200"
                    >
                      일반
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* User ID */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>사용자 ID</span>
              </div>
              <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                <p className="text-sm font-mono">{myPersona.user_id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PersonaPage;
