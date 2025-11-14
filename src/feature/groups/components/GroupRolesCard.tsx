"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
import { Button } from "@/shared/ui/button";
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
import { Shield, Trash2 } from "lucide-react";
import { useGetGroupRoles } from "../hooks/useGetGroupRoles";
import { useDeleteGroupRole } from "../hooks/useDeleteGroupRole";
import { useQueryClient } from "@tanstack/react-query";
import AddGroupRoleDialog from "./AddGroupRoleDialog";

interface GroupRolesCardProps {
  groupId: number;
}

export default function GroupRolesCard({ groupId }: GroupRolesCardProps) {
  const queryClient = useQueryClient();
  const [roleToDelete, setRoleToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // 그룹 역할 조회
  const { data: groupRoles, isLoading: isLoadingGroupRoles } = useGetGroupRoles(
    { group_id: groupId },
    { enabled: !!groupId }
  );

  // 그룹 역할 삭제 mutation
  const deleteRoleMutation = useDeleteGroupRole({
    onSuccess: () => {
      // 그룹 역할 목록 새로고침
      queryClient.invalidateQueries({
        queryKey: ["groups", groupId, "roles"],
      });
      // 다이얼로그 닫기
      setRoleToDelete(null);
    },
    meta: {
      successMessage: "그룹 역할이 성공적으로 제거되었습니다.",
    },
  });

  // 이미 할당된 역할 ID 목록
  const assignedRoleIds = groupRoles?.map((role) => role.id) || [];

  // 삭제 다이얼로그 열기
  const handleOpenDeleteDialog = (roleId: number, roleName: string) => {
    setRoleToDelete({ id: roleId, name: roleName });
  };

  // 삭제 실행
  const handleDeleteRole = () => {
    if (!roleToDelete) return;

    deleteRoleMutation.mutate({
      group_id: groupId,
      role_id: roleToDelete.id,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            그룹 역할 ({groupRoles?.length || 0})
          </CardTitle>
          <AddGroupRoleDialog
            groupId={groupId}
            assignedRoleIds={assignedRoleIds}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoadingGroupRoles && (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}
        {!isLoadingGroupRoles && (
          <>
            <div className="space-y-3">
              {groupRoles?.map((role) => (
                <div
                  key={role.id}
                  className="relative flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {role.role_name}
                    </p>
                    <p className="text-xs text-muted-foreground mb-1">
                      ID: #{role.id}
                    </p>
                    {role.description && (
                      <p className="text-xs text-muted-foreground/80 line-clamp-2 mt-1">
                        {role.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className="text-xs">
                      역할
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      onClick={() =>
                        handleOpenDeleteDialog(role.id, role.role_name)
                      }
                      disabled={deleteRoleMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {!groupRoles?.length && (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">
                  할당된 역할이 없습니다
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  역할 추가 버튼을 클릭하여 그룹에 역할을 할당하세요
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog
        open={!!roleToDelete}
        onOpenChange={(open) => {
          if (!open) setRoleToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              그룹 역할 제거 확인
            </AlertDialogTitle>
            <AlertDialogDescription>
              정말로 <strong>{roleToDelete?.name}</strong> 역할을 이 그룹에서
              제거하시겠습니까?
              <br />
              <span className="text-xs text-muted-foreground mt-2 block">
                이 작업은 되돌릴 수 없습니다.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteRoleMutation.isPending}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteRole();
              }}
              disabled={deleteRoleMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteRoleMutation.isPending && (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  제거 중...
                </>
              )}
              {!deleteRoleMutation.isPending && (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  제거
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
