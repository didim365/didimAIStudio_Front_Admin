"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
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
  Settings,
  UserCircle,
  ArrowLeft,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { formatPhoneNumber } from "@/feature/users/_utils/formatPhoneNumber";
import { formatDate } from "@/shared/utils/formatDate";
import { getInitials } from "@/feature/users/_utils/getInitials";
import { formatUserStatus } from "@/feature/users/_utils/formatUserStatus";
import type { GetUserResponse } from "../_api/getUser";
import { useDeleteUser } from "../_hooks/useDeleteUser";
import JsonView from "@uiw/react-json-view";

interface UserPageProps {
  user: GetUserResponse;
}

export function UserPage({ user }: UserPageProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteUserMutation = useDeleteUser({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      router.push("/users");
    },
    meta: {
      successMessage: "사용자가 성공적으로 삭제되었습니다.",
    },
  });

  const handleDelete = () => {
    deleteUserMutation.mutate({ user_id: user.id });
    setShowDeleteDialog(false);
  };
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
          <Link href={`/users/${user.id}/edit`}>
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
              정말
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
                  {formatUserStatus(user.status)}
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

                {/* Created At */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">계정 생성일</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    {formatDate(user.created_at)}
                  </p>
                </div>

                {/* Updated At */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">마지막 업데이트</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    {formatDate(user.updated_at)}
                  </p>
                </div>

                {/* Last Login */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">마지막 로그인</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    {formatDate(user.last_login)}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Preferences */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span>사용자 개인설정 (테마, 언어 등)</span>
              </div>
              <div className="ml-6 p-3 bg-muted rounded-lg border border-border overflow-x-auto">
                {user.preferences ? (
                  <JsonView
                    value={user.preferences}
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
    </div>
  );
}
