"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePostGroups } from "../hooks/usePostGroups";
import { useGetUsers } from "@/feature/users/hooks/useGetUsers";
import { useGetRoles } from "@/feature/users/hooks/useGetRoles";
import { useGetMyInfo } from "@/shared/hooks/useGetMyInfo";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  Users,
  ArrowLeft,
  Save,
  Shield,
  Building2,
  Network,
  UserCog,
  FolderTree,
} from "lucide-react";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { Skeleton } from "@/shared/ui/skeleton";
import ParentGroupSelect from "../components/ParentGroupSelect";

type GroupType = "COMPANY" | "DEPARTMENT" | "TEAM" | "PERSONAL";

const GROUP_TYPE_OPTIONS = [
  { value: "COMPANY" as const, label: "회사", icon: Building2 },
  { value: "DEPARTMENT" as const, label: "부서", icon: Network },
  { value: "TEAM" as const, label: "팀", icon: Users },
  { value: "PERSONAL" as const, label: "개인", icon: UserCog },
];

export default function GroupAddPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 현재 사용자 정보 조회
  const { data: myInfo, isLoading: isLoadingMyInfo } = useGetMyInfo();

  const [formData, setFormData] = useState({
    group_name: "",
    group_type: "COMPANY" as GroupType,
    parent_group_id: undefined as number | undefined,
    parent: undefined as number | undefined,
    manager: undefined as number | undefined,
    role_id: undefined as number | undefined,
  });

  // 사용자 목록 조회 (관리자, parent 선택용)
  const { data: users, isLoading: isLoadingUsers } = useGetUsers({
    page: 1,
    size: 100,
  });

  // 역할 목록 조회
  const { data: roles, isLoading: isLoadingRoles } = useGetRoles();

  // 그룹 생성 mutation
  const { mutate: createGroup, isPending: isCreating } = usePostGroups({
    onSuccess: (data) => {
      toast.success("그룹이 성공적으로 생성되었습니다.");
      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
      // 그룹 목록 페이지로 이동
      router.push("/groups");
    },
    onError: (error) => {
      toast.error("그룹 생성에 실패했습니다.");
      console.error("그룹 생성 오류:", error);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!myInfo?.id) {
      toast.error("사용자 정보를 불러올 수 없습니다.");
      return;
    }

    if (!formData.role_id) {
      toast.error("역할을 선택해주세요.");
      return;
    }

    createGroup({
      group_name: formData.group_name,
      group_type: formData.group_type,
      parent_group_id: formData.parent_group_id || null,
      parent: formData.parent ? String(formData.parent) : null,
      manager: formData.manager || null,
      creator: myInfo.id,
      role_id: formData.role_id,
    });
  };

  const selectedRole = roles?.find((r) => r.id === formData.role_id);

  // 로딩 중일 때
  if (isLoadingMyInfo) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => router.push("/groups")}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Users className="h-8 w-8" />새 그룹 추가
              </h1>
              <p className="text-muted-foreground mt-1">
                새로운 그룹을 생성합니다
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="submit"
              className="shrink-0"
              disabled={isCreating || !myInfo}
            >
              <Save className="h-4 w-4 mr-2" />
              {isCreating ? "생성 중..." : "그룹 생성"}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* 기본 정보 Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* 그룹명 */}
                <div className="space-y-2">
                  <Label
                    htmlFor="group_name"
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>그룹명 *</span>
                  </Label>
                  <Input
                    id="group_name"
                    value={formData.group_name}
                    onChange={(e) =>
                      setFormData({ ...formData, group_name: e.target.value })
                    }
                    placeholder="예: 개발팀"
                    className="pl-6"
                    required
                  />
                </div>

                {/* 그룹 타입 */}
                <div className="space-y-2">
                  <Label
                    htmlFor="group_type"
                    className="flex items-center gap-2"
                  >
                    <Network className="h-4 w-4" />
                    <span>그룹 타입 *</span>
                  </Label>
                  <Select
                    value={formData.group_type}
                    onValueChange={(value: GroupType) =>
                      setFormData({ ...formData, group_type: value })
                    }
                    required
                  >
                    <SelectTrigger id="group_type" className="pl-6 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GROUP_TYPE_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 계층 구조 Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderTree className="h-5 w-5" />
                계층 구조
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 상위 그룹 */}
                <ParentGroupSelect
                  value={formData.parent_group_id}
                  onChange={(value) =>
                    setFormData({ ...formData, parent_group_id: value })
                  }
                />

                {/* Parent (사용자) */}
                <div className="space-y-2">
                  <Label htmlFor="parent" className="flex items-center gap-2">
                    <UserCog className="h-4 w-4" />
                    <span>상위 사용자</span>
                  </Label>
                  {isLoadingUsers && <Skeleton className="h-10 w-full" />}
                  <Select
                    value={formData.parent?.toString() || "none"}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        parent: value === "none" ? undefined : Number(value),
                      })
                    }
                  >
                    <SelectTrigger id="parent" className="pl-6 w-full">
                      <SelectValue placeholder="상위 사용자 선택 (선택사항)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">상위 사용자 없음</SelectItem>
                      {users?.items?.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">
                              {user.full_name || user.email}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {user.email}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    상위 사용자를 선택하세요 (선택사항)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 관리 정보 Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                관리 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 관리자 */}
                <div className="space-y-2">
                  <Label htmlFor="manager" className="flex items-center gap-2">
                    <UserCog className="h-4 w-4" />
                    <span>관리자</span>
                  </Label>
                  {isLoadingUsers && <Skeleton className="h-10 w-full" />}
                  <Select
                    value={formData.manager?.toString() || "none"}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        manager: value === "none" ? undefined : Number(value),
                      })
                    }
                  >
                    <SelectTrigger id="manager" className="pl-6 w-full">
                      <SelectValue placeholder="관리자 선택 (선택사항)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">관리자 없음</SelectItem>
                      {users?.items?.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">
                              {user.full_name || user.email}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {user.email}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <p className="text-xs text-muted-foreground">
                    그룹을 관리할 관리자를 선택하세요
                  </p>
                </div>

                {/* 생성자 (자동) */}
                <div className="space-y-2">
                  <Label htmlFor="creator" className="flex items-center gap-2">
                    <UserCog className="h-4 w-4" />
                    <span>생성자 *</span>
                  </Label>
                  <Input
                    id="creator"
                    value={myInfo?.full_name || myInfo?.email || ""}
                    disabled
                    className="pl-6 bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    현재 로그인한 사용자가 자동으로 설정됩니다
                  </p>
                </div>

                {/* 역할 */}
                <div className="space-y-2">
                  <Label htmlFor="role_id" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>역할 *</span>
                  </Label>
                  {isLoadingRoles && <Skeleton className="h-10 w-full" />}
                  <Select
                    value={formData.role_id?.toString() || ""}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        role_id: Number(value),
                      })
                    }
                    required
                  >
                    <SelectTrigger id="role_id" className="pl-6 w-full">
                      <SelectValue placeholder="역할 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles?.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">
                              {role.role_name}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    그룹에 할당할 역할을 선택하세요
                  </p>
                </div>

                {/* 역할 정보 표시 */}
                {selectedRole && (
                  <div className="p-4 bg-muted rounded-lg border border-border">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="font-semibold">
                          {selectedRole.role_name}
                        </span>
                      </div>
                      {selectedRole.description && (
                        <p className="text-sm text-muted-foreground">
                          {selectedRole.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Alert */}
        <Alert>
          <AlertDescription className="flex items-center gap-2">
            <span className="text-sm">
              * 표시된 필드는 필수 입력 항목입니다. 그룹 생성 후 추가 정보는
              그룹 상세 페이지에서 수정할 수 있습니다.
            </span>
          </AlertDescription>
        </Alert>
      </div>
    </form>
  );
}
