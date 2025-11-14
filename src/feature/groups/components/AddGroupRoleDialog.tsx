"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Skeleton } from "@/shared/ui/skeleton";
import { ShieldPlus, Loader2, Shield, Check } from "lucide-react";
import { useGetRoles } from "@/feature/users/hooks/useGetRoles";
import { usePostGroupRole } from "../hooks/usePostGroupRole";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/shared/lib/utils";

interface AddGroupRoleDialogProps {
  groupId: number;
  assignedRoleIds?: number[];
}

export default function AddGroupRoleDialog({
  groupId,
  assignedRoleIds = [],
}: AddGroupRoleDialogProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number | undefined>();

  // 역할 목록 조회
  const { data: roles, isLoading: isLoadingRoles } = useGetRoles();

  // 그룹 역할 추가 mutation
  const { mutate: addGroupRole, isPending: isAddingRole } = usePostGroupRole({
    onSuccess: () => {
      // 그룹 정보 및 그룹 역할 새로고침
      queryClient.invalidateQueries({
        queryKey: ["groups", groupId, "roles"],
      });
      // 다이얼로그 닫기 및 초기화
      setOpen(false);
      setSelectedRoleId(undefined);
    },
  });

  const handleAddRole = () => {
    if (!selectedRoleId) return;

    addGroupRole({
      group_id: groupId,
      role_id: selectedRoleId,
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // 다이얼로그가 닫힐 때 상태 초기화
      setSelectedRoleId(undefined);
    }
  };

  // 이미 할당된 역할을 제외한 목록
  const availableRoles = roles?.filter(
    (role) => !assignedRoleIds.includes(role.id)
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <ShieldPlus className="h-4 w-4" />
          역할 추가
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldPlus className="h-5 w-5" />
            그룹 역할 추가
          </DialogTitle>
          <DialogDescription>
            그룹에 추가할 역할을 선택하세요. 이미 할당된 역할은 표시되지
            않습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 역할 목록 */}
          <div className="space-y-2">
            <Label>역할 선택</Label>
            <div className="border rounded-lg max-h-[400px] overflow-y-auto">
              {isLoadingRoles && (
                <div className="space-y-2 p-2">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              )}

              {!isLoadingRoles && (
                <div className="p-2 space-y-2">
                  {availableRoles?.map((role) => {
                    const isSelected = selectedRoleId === role.id;
                    return (
                      <Button
                        key={role.id}
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start h-auto py-4 px-4 hover:bg-accent/50 transition-all",
                          isSelected &&
                            "border-primary bg-primary/5 hover:bg-primary/10"
                        )}
                        onClick={() => setSelectedRoleId(role.id)}
                        disabled={isAddingRole}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div
                            className={cn(
                              "h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-colors",
                              isSelected ? "bg-primary/20" : "bg-muted"
                            )}
                          >
                            <Shield
                              className={cn(
                                "h-5 w-5 text-muted-foreground",
                                isSelected && "text-primary"
                              )}
                            />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="font-semibold text-sm mb-1">
                              {role.role_name}
                            </p>
                            <p className="text-xs text-muted-foreground mb-1">
                              ID: #{role.id}
                            </p>
                            {role.description && (
                              <p className="text-xs text-muted-foreground/80 line-clamp-2">
                                {role.description}
                              </p>
                            )}
                          </div>
                          {isSelected && (
                            <Check className="h-5 w-5 text-primary shrink-0" />
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              )}

              {!isLoadingRoles &&
                (!availableRoles || availableRoles.length === 0) && (
                  <div className="text-center py-12 px-4">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground font-medium mb-1">
                      사용 가능한 역할이 없습니다
                    </p>
                    <p className="text-xs text-muted-foreground">
                      모든 역할이 이미 할당되었거나 역할이 존재하지 않습니다.
                    </p>
                  </div>
                )}
            </div>

            {availableRoles && availableRoles.length > 0 && (
              <p className="text-xs text-muted-foreground">
                사용 가능한 역할 {availableRoles.length}개
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isAddingRole}
          >
            취소
          </Button>
          <Button
            type="submit"
            onClick={handleAddRole}
            disabled={!selectedRoleId || isAddingRole}
          >
            {isAddingRole && (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                추가 중...
              </>
            )}
            {!isAddingRole && (
              <>
                <ShieldPlus className="h-4 w-4 mr-2" />
                추가하기
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
