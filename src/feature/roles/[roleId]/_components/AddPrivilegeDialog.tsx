"use client";

import { useState } from "react";
import { Plus, Key, FileText, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useGetPrivileges } from "@/feature/privileges/_hooks/useGetPrivileges";
import { usePostRolePrivilege } from "../_hooks/usePostRolePrivilege";
import { useGetRolePrivileges } from "../_hooks/useGetRolePrivileges";
import { getActionTypeInfo } from "@/feature/privileges/_constants/actionType";
import { cn } from "@/shared/lib/utils";

interface AddPrivilegeDialogProps {
  roleId: number;
}

/**
 * 역할에 권한 추가 다이얼로그
 */
export function AddPrivilegeDialog({ roleId }: AddPrivilegeDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedPrivilegeId, setSelectedPrivilegeId] = useState<number | null>(
    null
  );

  const queryClient = useQueryClient();

  // 모든 권한 조회
  const { data: allPrivileges, isLoading: isLoadingPrivileges } =
    useGetPrivileges({
      enabled: open, // 다이얼로그가 열릴 때만 조회
    });

  // 현재 역할의 권한 조회 (이미 캐싱된 데이터 사용)
  const { data: currentPrivileges } = useGetRolePrivileges(
    { role_id: roleId },
    { enabled: open }
  );

  // 권한 추가 mutation
  const { mutate: addPrivilege, isPending: isAdding } = usePostRolePrivilege({
    onSuccess: () => {
      toast.success("권한이 성공적으로 추가되었습니다.", {
        description: "역할에 새로운 권한이 할당되었습니다.",
      });
      // 쿼리 새로고침
      queryClient.invalidateQueries({
        queryKey: ["roles", roleId, "privileges"],
      });
      // 다이얼로그 닫기 및 상태 초기화
      setOpen(false);
      setSelectedPrivilegeId(null);
    },
  });

  // 이미 연결된 권한 ID 목록
  const existingPrivilegeIds = new Set(currentPrivileges?.map((p) => p.id));

  // 이미 연결된 권한 제외
  const availablePrivileges = allPrivileges?.filter(
    (privilege) => !existingPrivilegeIds.has(privilege.id)
  );

  const handleAddPrivilege = () => {
    if (!selectedPrivilegeId) {
      toast.error("권한을 선택해주세요.");
      return;
    }

    addPrivilege({
      role_id: roleId,
      privilege_id: selectedPrivilegeId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          권한 추가
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            권한 추가
          </DialogTitle>
          <DialogDescription>
            역할에 할당할 권한을 선택해주세요. 이미 연결된 권한은 표시되지
            않습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 권한 목록 */}
          <div className="h-[400px] overflow-y-auto pr-4">
            {isLoadingPrivileges && (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            )}

            {!isLoadingPrivileges && availablePrivileges?.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Key className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  추가할 수 있는 권한이 없습니다.
                </p>
              </div>
            )}

            <div className="space-y-2">
              {availablePrivileges?.map((privilege) => {
                const actionInfo = getActionTypeInfo(
                  privilege.action_type,
                  true
                );
                const ActionIcon = actionInfo.icon;
                const isSelected = selectedPrivilegeId === privilege.id;

                return (
                  <Card
                    key={privilege.id}
                    className={cn(
                      "cursor-pointerhover:shadow-md hover:border-primary/50",
                      isSelected && "border-primary border-2 bg-primary/5"
                    )}
                    onClick={() => setSelectedPrivilegeId(privilege.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* 선택 인디케이터 */}
                        <div
                          className={cn(
                            "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-colors bg-primary/10 text-primary",
                            isSelected && "bg-primary text-primary-foreground"
                          )}
                        >
                          {isSelected && <Zap className="h-5 w-5" />}
                          {!isSelected && <Key className="h-5 w-5" />}
                        </div>

                        {/* 권한 정보 */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <h4 className="font-semibold text-sm flex items-center gap-2">
                                {privilege.privilege_name}
                              </h4>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="text-xs font-mono"
                                >
                                  #{privilege.id}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`${actionInfo.color} shrink-0 text-xs`}
                                >
                                  <ActionIcon className="h-3 w-3 mr-1" />
                                  {actionInfo.label}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {privilege.description}
                              </p>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3 text-muted-foreground" />
                              <span className="font-mono text-muted-foreground">
                                {privilege.resource_type}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ActionIcon className="h-3 w-3 text-muted-foreground" />
                              <span className="font-mono text-muted-foreground">
                                {privilege.action_type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button
            onClick={handleAddPrivilege}
            disabled={!selectedPrivilegeId || isAdding}
          >
            {isAdding ? "추가 중..." : "권한 추가"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddPrivilegeDialog;
