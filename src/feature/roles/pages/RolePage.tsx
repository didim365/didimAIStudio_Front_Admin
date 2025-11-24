"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useGetRole } from "../hooks/useGetRole";
import { useDeleteRole } from "../hooks/useDeleteRole";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
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
  Shield,
  Calendar,
  Clock,
  ArrowLeft,
  Pencil,
  Trash2,
  Hash,
  FileText,
  UserCircle,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { formatDate } from "@/shared/utils/formatDate";
import { RolePrivileges } from "../components/RolePrivileges";
import { GetRoleResponse } from "../api/getRole";

function RolePage({ role }: { role: GetRoleResponse }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // 역할 삭제 mutation
  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole({
    onSuccess: () => {
      // 역할 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
      router.push("/roles");
    },
  });

  const handleDelete = () => {
    deleteRole({ role_id: role.id });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/roles">
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
              역할 상세 정보
            </h1>
            <p className="text-muted-foreground">역할 ID: {role.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/roles/${role.id}/edit`}>
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
            <AlertDialogTitle>역할 삭제 확인</AlertDialogTitle>
            <AlertDialogDescription>
              정말 <span className="font-semibold">{role.role_name}</span>
              을(를) 삭제하시겠습니까?
              <br />
              <span className="text-destructive mt-2 block">
                이 작업은 되돌릴 수 없습니다. 이 역할을 사용하는 사용자나 그룹이
                있으면 삭제할 수 없습니다.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              역할 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Icon */}
              <div className="flex flex-col items-center gap-4">
                <div className="h-32 w-32 border-4 border-background shadow-lg rounded-2xl from-primary/20 to-primary/5 flex items-center justify-center">
                  <Shield className="h-16 w-16 text-primary" />
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                  역할
                </Badge>
              </div>

              {/* Role Info Grid */}
              <div className="flex-1 grid gap-4 md:grid-cols-2">
                {/* Role Name */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">역할명</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">{role.role_name}</p>
                </div>

                {/* Role ID */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    <span className="font-medium">역할 ID</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">#{role.id}</p>
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">설명</span>
                  </div>
                  <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                    {role.description && (
                      <p className="text-sm whitespace-pre-wrap">
                        {role.description}
                      </p>
                    )}
                    {!role.description && (
                      <p className="text-sm text-muted-foreground italic">
                        설명이 없습니다
                      </p>
                    )}
                  </div>
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
                <span>역할 생성일</span>
              </div>
              <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                <p className="text-sm font-mono">
                  {formatDate(role.created_at)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              추가 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Role ID Display */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span>역할 식별자</span>
              </div>
              <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                <p className="text-sm font-mono">#{role.id}</p>
              </div>
            </div>

            <Separator />

            {/* Role Name Display */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span>역할 시스템 이름</span>
              </div>
              <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                <p className="text-sm font-mono break-all">{role.role_name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Privileges Section */}
      <RolePrivileges roleId={role.id} />
    </div>
  );
}

export default RolePage;
