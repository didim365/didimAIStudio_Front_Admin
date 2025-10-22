"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Shield, FolderTree, Settings, Eye, Plus } from "lucide-react";
import { Label } from "@/shared/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { GroupTree } from "./GroupTree";
import { RoleCard } from "./RoleCard";
import { PermissionsList } from "./PermissionsList";
import {
  groupMembers,
  roles,
  groups,
  permissions,
  resources,
} from "../utils/mockData";
import { usePermissions } from "../hooks/usePermissions";

export default function PermissionsPage() {
  const {
    selectedRole,
    setSelectedRole,
    isPassportDialogOpen,
    setIsPassportDialogOpen,
    passportData,
    isDarkMode,
    themeKey,
    simulatePassport,
  } = usePermissions();

  return (
    <div key={themeKey}>
      {/* 헤더 */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ color: isDarkMode ? "#ffffff" : undefined }}
        >
          권한 관리
        </h1>
        <p
          className="mt-2"
          style={{ color: isDarkMode ? "#cccccc" : undefined }}
        >
          역할(Role), 그룹(Group), 권한(Permission) 관리
        </p>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="roles" className="gap-2">
            <Shield className="h-4 w-4" />
            역할 관리
          </TabsTrigger>
          <TabsTrigger value="groups" className="gap-2">
            <FolderTree className="h-4 w-4" />
            그룹 관리
          </TabsTrigger>
          <TabsTrigger value="permissions" className="gap-2">
            <Settings className="h-4 w-4" />
            권한 관리
          </TabsTrigger>
          <TabsTrigger value="passport" className="gap-2">
            <Eye className="h-4 w-4" />
            Passport 미리보기
          </TabsTrigger>
        </TabsList>

        {/* 역할 관리 탭 */}
        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>역할 목록</CardTitle>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                역할 추가
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {roles.map((role) => (
                  <RoleCard
                    key={role.id}
                    role={role}
                    isSelected={selectedRole.id === role.id}
                    isDarkMode={isDarkMode}
                    onClick={() => setSelectedRole(role)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 선택된 역할 상세 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>역할 상세 정보: {selectedRole.displayName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>역할 이름</Label>
                    <Input defaultValue={selectedRole.name} />
                  </div>
                  <div className="space-y-2">
                    <Label>표시 이름</Label>
                    <Input defaultValue={selectedRole.displayName} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>설명</Label>
                  <Input defaultValue={selectedRole.description} />
                </div>

                <div className="space-y-3">
                  <Label className="text-base">권한 목록</Label>
                  <PermissionsList
                    permissions={permissions}
                    selectedRole={selectedRole}
                    isDarkMode={isDarkMode}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">취소</Button>
                  <Button>변경사항 저장</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 그룹 관리 탭 */}
        <TabsContent value="groups" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>조직 구조</CardTitle>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                그룹 추가
              </Button>
            </CardHeader>
            <CardContent>
              {groups.map((group) => (
                <GroupTree
                  key={group.id}
                  group={group}
                  isDarkMode={isDarkMode}
                  groupMembers={groupMembers}
                />
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>그룹별 역할 매핑</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="border rounded-lg p-4">
                    <div
                      className="font-medium mb-3"
                      style={{ color: isDarkMode ? "#ffffff" : undefined }}
                    >
                      R&D그룹 (59)
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className="text-sm"
                          style={{ color: isDarkMode ? "#cccccc" : undefined }}
                        >
                          매니저 역할 부여
                        </span>
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className="text-sm"
                          style={{ color: isDarkMode ? "#cccccc" : undefined }}
                        >
                          관리자 역할 부여
                        </span>
                        <input type="checkbox" className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>리소스 접근 권한</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resources.map((resource, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div
                          className="font-medium text-sm"
                          style={{ color: isDarkMode ? "#ffffff" : undefined }}
                        >
                          {resource.name}
                        </div>
                        <div
                          className="text-xs"
                          style={{ color: isDarkMode ? "#cccccc" : undefined }}
                        >
                          {resource.description}
                        </div>
                      </div>
                      <Badge variant="outline">접근 가능</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 권한 관리 탭 */}
        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>권한 목록</CardTitle>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                권한 추가
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {permissions.map((permission) => (
                  <Card key={permission.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-blue-600" />
                          <div
                            className="font-semibold"
                            style={{ color: isDarkMode ? "#ffffff" : undefined }}
                          >
                            {permission.name}
                          </div>
                        </div>
                        <p
                          className="text-sm"
                          style={{ color: isDarkMode ? "#cccccc" : undefined }}
                        >
                          {permission.description}
                        </p>
                        <div className="pt-2">
                          <Badge variant="outline">
                            {
                              roles.filter((r) =>
                                r.permissions.includes(permission.name)
                              ).length
                            }
                            개 역할에서 사용
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Passport 미리보기 탭 */}
        <TabsContent value="passport" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Passport 시뮬레이션</CardTitle>
              <p className="text-sm text-slate-500">
                특정 사용자의 Passport를 미리보기하여 권한을 확인합니다
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input placeholder="사용자 ID 입력 (예: 52)" />
                  <Button onClick={simulatePassport} className="gap-2">
                    <Eye className="h-4 w-4" />
                    Passport 조회
                  </Button>
                </div>

                <div className="border rounded-lg p-4 bg-slate-50">
                  <div className="text-sm font-medium text-slate-700 mb-2">
                    예시 Passport 구조:
                  </div>
                  <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg overflow-auto">
                    {JSON.stringify(
                      {
                        user_id: 52,
                        global_roles: ["USER"],
                        group_roles: { "59": ["AGENTS_MANAGER"] },
                        permissions: ["READ", "WRITE"],
                        groups: ["디딤365", "클라우드부문", "R&D그룹"],
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Passport 다이얼로그 */}
      <Dialog
        open={isPassportDialogOpen}
        onOpenChange={setIsPassportDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>사용자 Passport</DialogTitle>
            <DialogDescription>
              선택한 사용자의 Security Context 정보
            </DialogDescription>
          </DialogHeader>
          {passportData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>사용자 ID</Label>
                  <div className="font-mono text-sm p-2 bg-slate-100 rounded">
                    {passportData.user_id}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>전역 역할</Label>
                  <div className="flex gap-2">
                    {passportData.global_roles.map((role: string) => (
                      <Badge key={role}>{role}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>그룹별 역할</Label>
                <div className="border rounded-lg p-4 bg-slate-50">
                  <pre className="text-sm">
                    {JSON.stringify(passportData.group_roles, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="space-y-2">
                <Label>권한 목록</Label>
                <div className="flex flex-wrap gap-2">
                  {passportData.permissions.map((perm: string) => (
                    <Badge key={perm} variant="outline">
                      {perm}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>소속 그룹</Label>
                <div className="flex flex-wrap gap-2">
                  {passportData.groups.map((group: string) => (
                    <Badge key={group} variant="outline">
                      <FolderTree className="h-3 w-3 mr-1" />
                      {group}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
