"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
import { Shield } from "lucide-react";
import { useGetGroupRoles } from "../hooks/useGetGroupRoles";
import AddGroupRoleDialog from "./AddGroupRoleDialog";

interface GroupRolesCardProps {
  groupId: number;
}

export default function GroupRolesCard({ groupId }: GroupRolesCardProps) {
  // 그룹 역할 조회
  const { data: groupRoles, isLoading: isLoadingGroupRoles } = useGetGroupRoles(
    { group_id: groupId },
    { enabled: !!groupId }
  );

  // 이미 할당된 역할 ID 목록
  const assignedRoleIds = groupRoles?.map((role) => role.id) || [];

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
                  className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
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
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    역할
                  </Badge>
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
    </Card>
  );
}
