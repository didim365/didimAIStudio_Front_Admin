"use client";

import { useState, FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePatchGroup } from "../hooks/usePatchGroup";
import { useGetGroups } from "../hooks/useGetGroups";
import { useGetUsers } from "@/feature/users/hooks/useGetUsers";
import { useGetRoles } from "@/feature/users/hooks/useGetRoles";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import {
  Building2,
  Calendar,
  Clock,
  ArrowLeft,
  Save,
  FolderTree,
  UserCircle,
  Shield,
  Hash,
} from "lucide-react";
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
import { useRouter } from "next/navigation";
import { formatDate } from "@/shared/utils/formatDate";
import {
  getGroupTypeLabel,
  GROUP_TYPE_ICONS,
  GROUP_TYPE_COLORS,
  GROUP_TYPE_OPTIONS,
} from "../constants/groupType";
import { GetGroupResponse } from "../api/getGroup";

export function GroupEditPage({ group }: { group: GetGroupResponse }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    group_name: group.group_name || "",
    group_type: group.group_type as
      | "COMPANY"
      | "DEPARTMENT"
      | "TEAM"
      | "PERSONAL",
    parent_group_id: group.parent_group_id || null,
    manager: group.manager || null,
    role_id: group.role_id || null,
  });

  // 그룹 목록 조회 (상위 그룹 선택용)
  const { data: groupsData } = useGetGroups();
  const availableParentGroups = groupsData?.items?.filter(
    (g) => g.id !== group.id
  );

  // 사용자 목록 조회 (매니저 선택용)
  const { data: usersData } = useGetUsers();

  // 역할 목록 조회
  const { data: roles } = useGetRoles();

  const { mutate: updateGroup, isPending: isUpdating } = usePatchGroup({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });

      router.push(`/groups/${group.id}`);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateGroup({
      params: { group_id: group.id },
      data: {
        group_name: formData.group_name || null,
        group_type: formData.group_type || null,
        parent_group: formData.parent_group_id || null,
        manager: formData.manager || null,
        role_id: formData.role_id || null,
      },
    });
  };

  if (!group) {
    return (
      <div className="py-8 px-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              그룹을 찾을 수 없습니다.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const GroupTypeIcon = GROUP_TYPE_ICONS[formData.group_type] || Building2;
  const groupTypeColor =
    GROUP_TYPE_COLORS[formData.group_type] ||
    "bg-gray-100 text-gray-700 border-gray-200";

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
              onClick={() => router.push(`/groups/${group.id}`)}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                그룹 정보 수정
              </h1>
              <p className="text-muted-foreground">그룹 ID: {group.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" className="shrink-0" disabled={isUpdating}>
              <Save className="h-4 w-4 mr-2" />
              {isUpdating ? "저장 중..." : "저장"}
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Group Info Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                그룹 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Icon Preview */}
                <div className="flex flex-col items-center gap-4">
                  <div className="h-32 w-32 border-4 border-background shadow-lg rounded-2xl flex items-center justify-center">
                    <GroupTypeIcon className="h-16 w-16 text-primary" />
                  </div>
                  <Badge className={`${groupTypeColor} border`}>
                    {getGroupTypeLabel(formData.group_type)}
                  </Badge>
                </div>

                {/* Group Form Grid */}
                <div className="flex-1 grid gap-4 md:grid-cols-2">
                  {/* Group ID (Read-only) */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="group_id"
                      className="flex items-center gap-2"
                    >
                      <Hash className="h-4 w-4" />
                      <span>그룹 ID</span>
                    </Label>
                    <Input
                      id="group_id"
                      value={group.id}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  {/* Group Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="group_name"
                      className="flex items-center gap-2"
                    >
                      <Building2 className="h-4 w-4" />
                      <span>그룹명 *</span>
                    </Label>
                    <Input
                      id="group_name"
                      value={formData.group_name}
                      onChange={(e) =>
                        setFormData({ ...formData, group_name: e.target.value })
                      }
                      placeholder="그룹명을 입력하세요"
                      required
                    />
                  </div>

                  {/* Group Type */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="group_type"
                      className="flex items-center gap-2"
                    >
                      <Building2 className="h-4 w-4" />
                      <span>그룹 타입 *</span>
                    </Label>
                    <Select
                      value={formData.group_type}
                      onValueChange={(
                        value: "COMPANY" | "DEPARTMENT" | "TEAM" | "PERSONAL"
                      ) => setFormData({ ...formData, group_type: value })}
                      required
                    >
                      <SelectTrigger id="group_type" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GROUP_TYPE_OPTIONS.map((option) => {
                          const Icon = option.icon;
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                {option.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Parent Group */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="parent_group_id"
                      className="flex items-center gap-2"
                    >
                      <FolderTree className="h-4 w-4" />
                      <span>상위 그룹</span>
                    </Label>
                    <Select
                      value={formData.parent_group_id?.toString() || "none"}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          parent_group_id:
                            value === "none" ? null : Number(value),
                        })
                      }
                    >
                      <SelectTrigger id="parent_group_id" className="w-full">
                        <SelectValue placeholder="상위 그룹 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">없음</SelectItem>
                        {availableParentGroups?.map((g) => (
                          <SelectItem key={g.id} value={g.id.toString()}>
                            {g.group_name} (#{g.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Manager */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="manager"
                      className="flex items-center gap-2"
                    >
                      <UserCircle className="h-4 w-4" />
                      <span>매니저</span>
                    </Label>
                    <Select
                      value={formData.manager?.toString() || "none"}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          manager: value === "none" ? null : Number(value),
                        })
                      }
                    >
                      <SelectTrigger id="manager" className="w-full">
                        <SelectValue placeholder="매니저 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">미지정</SelectItem>
                        {usersData?.items?.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.full_name || user.email} (#{user.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="role_id"
                      className="flex items-center gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      <span>권한</span>
                    </Label>
                    <Select
                      value={formData.role_id?.toString() || "none"}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          role_id: value === "none" ? null : Number(value),
                        })
                      }
                    >
                      <SelectTrigger id="role_id" className="w-full">
                        <SelectValue placeholder="권한 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">미지정</SelectItem>
                        {roles?.map((role) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.role_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <span>그룹 생성일</span>
                </div>
                <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                  <p className="text-sm font-mono">
                    {formatDate(group.created_at)}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Updated At */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>마지막 업데이트</span>
                </div>
                <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                  <p className="text-sm font-mono">
                    {group.updated_at && formatDate(group.updated_at)}
                    {!group.updated_at && "없음"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                추가 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Member Count */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                  <span>현재 멤버 수</span>
                </div>
                <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                  <p className="text-sm font-mono">{group.member_count}명</p>
                </div>
              </div>

              <Separator />

              {/* Creator */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                  <span>생성자 ID</span>
                </div>
                <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                  <p className="text-sm font-mono">#{group.creator}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
