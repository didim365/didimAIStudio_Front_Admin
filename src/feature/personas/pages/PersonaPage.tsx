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
import { categoryConfig } from "../constants/categoryConfig";

import type { GetPersonaResponse } from "../api/getPersona";
import useDeletePersona from "../hooks/useDeletePersona";
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
    router.push("/studio/personas");
  };

  const personaTitle = persona.user_persona_title ?? persona.name;
  const personaDescription =
    persona.user_persona_description ?? persona.description;
  const isCustomized =
    !!persona.user_persona_title || !!persona.user_persona_description;
  const categoryInfo = categoryConfig[persona.category] || {
    label: persona.category,
    color: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/studio/personas">
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
          <Link href={`/studio/personas/${persona.id}/edit`}>
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
              정말 <span className="font-semibold">{personaTitle}</span>
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
              {/* Icon */}
              <div className="flex flex-col items-center gap-4">
                <div className="h-32 w-32 border-4 border-background shadow-lg rounded-2xl from-primary/20 to-primary/5 flex items-center justify-center">
                  <Sparkles className="h-16 w-16 text-primary" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Badge className={`${categoryInfo.color} border`}>
                    {categoryInfo.label}
                  </Badge>
                  {isCustomized && (
                    <Badge className="bg-green-100 text-green-800 border-green-200 border">
                      <Shield className="h-3 w-3 mr-1" />
                      커스터마이징됨
                    </Badge>
                  )}
                </div>
              </div>

              {/* Persona Info Grid */}
              <div className="flex-1 grid gap-4 md:grid-cols-2">
                {/* Title */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">
                      {persona.user_persona_title ? "커스텀 제목" : "제목"}
                    </span>
                  </div>
                  <p className="text-lg font-semibold pl-6">{personaTitle}</p>
                  {persona.user_persona_title && persona.name && (
                    <p className="text-sm text-muted-foreground pl-6">
                      원본: {persona.name}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">
                      {persona.user_persona_description
                        ? "커스텀 설명"
                        : "설명"}
                    </span>
                  </div>
                  <p className="text-sm pl-6 leading-relaxed">
                    {personaDescription}
                  </p>
                  {persona.user_persona_description && persona.description && (
                    <p className="text-sm text-muted-foreground pl-6 leading-relaxed">
                      원본: {persona.description}
                    </p>
                  )}
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
                {persona.is_system && (
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-purple-100 text-purple-800 border-purple-200"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      시스템 페르소나
                    </Badge>
                  </div>
                )}
                {!persona.is_system && (
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 border-green-200"
                    >
                      <User className="h-3 w-3 mr-1" />
                      사용자 페르소나
                    </Badge>
                  </div>
                )}
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

            {isCustomized && (
              <>
                <Separator />
                {/* Customization Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>커스터마이징</span>
                  </div>
                  <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                    <div className="space-y-1">
                      {persona.user_persona_title && (
                        <p className="text-sm">
                          <span className="font-medium">• 제목이 수정됨</span>
                        </p>
                      )}
                      {persona.user_persona_description && (
                        <p className="text-sm">
                          <span className="font-medium">• 설명이 수정됨</span>
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        사용자가 이 페르소나를 자신만의 방식으로
                        커스터마이징했습니다
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PersonaPage;
