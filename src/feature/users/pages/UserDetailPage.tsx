"use client";

import { useState } from "react";
import { useGetUser } from "../hooks/useGetUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
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
  Mail,
  Phone,
  Calendar,
  Clock,
  Activity,
  Settings,
  UserCircle,
  Image as ImageIcon,
  ArrowLeft,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { formatPhoneNumber } from "@/feature/users/utils/formatPhoneNumber";
import { formatDate } from "@/feature/users/utils/formatDate";
import { getInitials } from "@/feature/users/utils/getInitials";

interface UserDetailPageProps {
  userId: string;
}

export function UserDetailPage({ userId }: UserDetailPageProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const {
    data: user,
    isLoading,
    error,
  } = useGetUser({ user_id: Number(userId) });

  const handleDelete = () => {
    // TODO: 사용자 삭제 API 호출
    console.log("사용자 삭제:", userId);
    setShowDeleteDialog(false);
    // TODO: 삭제 후 사용자 목록 페이지로 이동하거나 리프레시
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
              사용자 정보를 불러오는 중 오류가 발생했습니다.
            </p>
            <p className="text-sm text-destructive mt-2">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-8 px-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              사용자를 찾을 수 없습니다.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/users">
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
              사용자 상세 정보
            </h1>
            <p className="text-muted-foreground">사용자 ID: {user.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/users/${userId}/edit`}>
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
            <AlertDialogTitle>사용자 삭제 확인</AlertDialogTitle>
            <AlertDialogDescription>
              정말{" "}
              <span className="font-semibold">
                {user.full_name || user.email}
              </span>
              를 삭제하시겠습니까?
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
              프로필 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                  <AvatarImage src={user.profile_image_url || undefined} />
                  <AvatarFallback className="text-3xl">
                    {getInitials(user.full_name, user.email)}
                  </AvatarFallback>
                </Avatar>
                <Badge className="bg-muted text-muted-foreground hover:bg-muted/80">
                  {user.status}
                </Badge>
              </div>

              {/* User Info Grid */}
              <div className="flex-1 grid gap-4 md:grid-cols-2">
                {/* Full Name */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="font-medium">이름</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    {user.full_name || "정보 없음"}
                  </p>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="font-medium">이메일</span>
                  </div>
                  <p className="text-lg font-semibold pl-6 break-all">
                    {user.email}
                  </p>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span className="font-medium">전화번호</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    {formatPhoneNumber(user.phone || "") || "정보 없음"}
                  </p>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Activity className="h-4 w-4" />
                    <span className="font-medium">사용자 ID</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">#{user.id}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              활동 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Created At */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>계정 생성일</span>
              </div>
              <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                <p className="text-sm font-mono">
                  {formatDate(user.created_at)}
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
                  {formatDate(user.updated_at)}
                </p>
              </div>
            </div>

            <Separator />

            {/* Last Login */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>마지막 로그인</span>
              </div>
              <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                <p className="text-sm font-mono">
                  {formatDate(user.last_login)}
                </p>
              </div>
            </div>
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
            {/* Profile Image URL */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                <span>프로필 이미지 URL</span>
              </div>
              <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                {user.profile_image_url ? (
                  <p className="text-sm font-mono break-all">
                    {user.profile_image_url}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    프로필 이미지가 설정되지 않았습니다
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* Preferences */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span>사용자 설정</span>
              </div>
              <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                {user.preferences &&
                Object.keys(user.preferences).length > 0 ? (
                  <pre className="text-sm font-mono overflow-x-auto">
                    {JSON.stringify(user.preferences, null, 2)}
                  </pre>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    설정된 값이 없습니다
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
