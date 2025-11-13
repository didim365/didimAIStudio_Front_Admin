"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
import { Key, Lock, FileText, AlertCircle } from "lucide-react";
import { useGetRolePrivileges } from "../hooks/useGetRolePrivileges";
import { getActionTypeInfo } from "@/feature/privileges/constants/actionType";

interface RolePrivilegesListProps {
  roleId: number;
}

/**
 * 역할에 연결된 권한 목록 컴포넌트
 */
export function RolePrivilegesList({ roleId }: RolePrivilegesListProps) {
  // 역할의 권한 조회
  const {
    data: privileges,
    isLoading,
    error,
  } = useGetRolePrivileges({ role_id: roleId });
  return (
    <div className="space-y-4">
      <Card className="border-primary/20">
        <CardHeader className="from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              연결된 권한
              {privileges && privileges.length > 0 && (
                <Badge className="ml-2 bg-primary">{privileges.length}개</Badge>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Loading State */}
          {isLoading && (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">
                  권한 정보를 불러오지 못했습니다
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {error.message}
                </p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && privileges && privileges.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <Lock className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                연결된 권한이 없습니다
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                이 역할에는 아직 권한이 할당되지 않았습니다.
              </p>
            </div>
          )}

          {/* Privileges List */}
          {!isLoading && !error && privileges && privileges.length > 0 && (
            <div className="space-y-3">
              {privileges.map((privilege) => {
                const actionInfo = getActionTypeInfo(
                  privilege.action_type,
                  true
                );
                const ActionIcon = actionInfo.icon;

                return (
                  <Card
                    key={privilege.id}
                    className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-primary/40"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Key className="h-6 w-6 text-primary" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-3">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <h4 className="font-semibold text-base flex items-center gap-2">
                                {privilege.privilege_name}
                                <Badge
                                  variant="outline"
                                  className="text-xs font-mono"
                                >
                                  #{privilege.id}
                                </Badge>
                              </h4>
                              {privilege.description && (
                                <p className="text-sm text-muted-foreground">
                                  {privilege.description}
                                </p>
                              )}
                            </div>

                            {/* Action Type Badge */}
                            <Badge
                              variant="outline"
                              className={`${actionInfo.color} shrink-0`}
                            >
                              <ActionIcon className="h-3 w-3 mr-1" />
                              {actionInfo.label}
                            </Badge>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t">
                            {/* Resource Type */}
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  리소스 타입
                                </p>
                                <p className="text-sm font-medium font-mono">
                                  {privilege.resource_type}
                                </p>
                              </div>
                            </div>

                            {/* Action Type Detail */}
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                                <ActionIcon className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  액션 타입
                                </p>
                                <p className="text-sm font-medium font-mono">
                                  {privilege.action_type}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default RolePrivilegesList;
