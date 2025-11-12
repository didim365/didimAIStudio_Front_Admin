"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGetPrivilege } from "../hooks/useGetPrivilege";
import { useDeletePrivilege } from "../hooks/useDeletePrivilege";
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
  Key,
  FileText,
  Database,
  Zap,
  ArrowLeft,
  Pencil,
  Trash2,
  Hash,
  Loader2,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import {
  ACTION_TYPE_VARIANTS,
  ACTION_TYPE_LABELS,
  ACTION_TYPE_COLORS,
} from "@/feature/privileges/constants/actionType";

interface PrivilegePageProps {
  privilegeId: number;
}

function PrivilegePage({ privilegeId }: PrivilegePageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const {
    data: privilege,
    isLoading,
    error,
  } = useGetPrivilege({ privilege_id: privilegeId });

  // 권한 삭제 mutation
  const { mutate: deletePrivilege, isPending: isDeleting } = useDeletePrivilege(
    {
      onSuccess: () => {
        toast.success("권한이 성공적으로 삭제되었습니다.");
        queryClient.invalidateQueries({
          queryKey: ["privileges"],
        });
        setShowDeleteDialog(false);
        router.push("/privileges");
      },
      onError: (error) => {
        toast.error("권한 삭제에 실패했습니다.");
        console.error("Error deleting privilege:", error);
      },
    }
  );

  const handleDelete = () => {
    deletePrivilege({ privilege_id: privilegeId });
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
              권한 정보를 불러오는 중 오류가 발생했습니다.
            </p>
            <p className="text-sm text-destructive mt-2">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!privilege) {
    return (
      <div className="py-8 px-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              권한을 찾을 수 없습니다.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const actionTypeColor =
    ACTION_TYPE_COLORS[privilege.action_type] ||
    "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/privileges">
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
              권한 상세 정보
            </h1>
            <p className="text-muted-foreground">권한 ID: {privilege.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/privileges/${privilegeId}/edit`}>
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
            <AlertDialogTitle>권한 삭제 확인</AlertDialogTitle>
            <AlertDialogDescription>
              정말{" "}
              <span className="font-semibold">{privilege.privilege_name}</span>
              를 삭제하시겠습니까?
              <br />
              <span className="text-destructive mt-2 block">
                이 작업은 되돌릴 수 없습니다. 이 권한을 사용하는 역할이 있으면
                삭제할 수 없습니다.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Privilege Info Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              권한 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Icon */}
              <div className="flex flex-col items-center gap-4">
                <div className="h-32 w-32 border-4 border-background shadow-lg rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Shield className="h-16 w-16 text-primary" />
                </div>
                <Badge className={`${actionTypeColor} border`}>
                  {ACTION_TYPE_LABELS[privilege.action_type] ||
                    privilege.action_type}
                </Badge>
              </div>

              {/* Privilege Info Grid */}
              <div className="flex-1 grid gap-4 md:grid-cols-2">
                {/* Privilege Name */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Key className="h-4 w-4" />
                    <span className="font-medium">권한명</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    {privilege.privilege_name}
                  </p>
                </div>

                {/* Privilege ID */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    <span className="font-medium">권한 ID</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">#{privilege.id}</p>
                </div>

                {/* Resource Type */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Database className="h-4 w-4" />
                    <span className="font-medium">리소스 타입</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    <Badge variant="outline" className="text-base">
                      {privilege.resource_type}
                    </Badge>
                  </p>
                </div>

                {/* Action Type */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4" />
                    <span className="font-medium">액션 타입</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    <Badge
                      variant={
                        ACTION_TYPE_VARIANTS[privilege.action_type] || "default"
                      }
                      className="text-base"
                    >
                      {ACTION_TYPE_LABELS[privilege.action_type] ||
                        privilege.action_type}
                    </Badge>
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">설명</span>
                  </div>
                  <p className="text-base pl-6 text-muted-foreground">
                    {privilege.description || "설명이 없습니다"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              상세 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 ">
            {/* Permission Summary */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span>권한 요약</span>
              </div>
              <div className="ml-6 p-4 rounded-lg border border-border">
                <p className="text-sm">
                  <span className="font-semibold">
                    {privilege.resource_type}
                  </span>{" "}
                  리소스에 대한{" "}
                  <Badge
                    variant={
                      ACTION_TYPE_VARIANTS[privilege.action_type] || "default"
                    }
                    className="mx-1"
                  >
                    {ACTION_TYPE_LABELS[privilege.action_type] ||
                      privilege.action_type}
                  </Badge>{" "}
                  권한
                </p>
              </div>
            </div>

            <Separator />

            {/* Resource Type Detail */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span>리소스 정보</span>
              </div>
              <div className="ml-6 p-3 rounded-lg border border-border">
                <p className="text-sm font-mono">{privilege.resource_type}</p>
              </div>
            </div>

            <Separator />

            {/* Action Type Detail */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <span>액션 정보</span>
              </div>
              <div className="ml-6 p-3 rounded-lg border border-border">
                <p className="text-sm font-mono">{privilege.action_type}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PrivilegePage;
