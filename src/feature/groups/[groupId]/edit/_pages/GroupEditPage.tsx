"use client";

import { useState, FormEvent, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePatchGroup } from "../_hooks/usePatchGroup";
import ParentGroupSelect from "../../../_components/ParentGroupSelect";
import ChildGroupsSelect from "../../../_components/ChildGroupsSelect";
import ManagerSelect from "../../../_components/ManagerSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import {
  Building2,
  ArrowLeft,
  Save,
  FolderTree,
  Shield,
  Hash,
  Network,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useRouter } from "next/navigation";
import {
  getGroupTypeLabel,
  GROUP_TYPE_ICONS,
  GROUP_TYPE_COLORS,
  GROUP_TYPE_OPTIONS,
} from "../../../_constants/groupType";
import { GetGroupResponse } from "../../_api/getGroup";
import { GetRolesResponse } from "@/feature/roles/_api/getRoles";
import { useGetGroups } from "../../../_hooks/useGetGroups";
import Link from "next/link";

export function GroupEditPage({
  group,
  roles,
}: {
  group: GetGroupResponse;
  roles: GetRolesResponse;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 현재 그룹의 하위 그룹을 가져오기 위한 쿼리
  const { data: groupsData } = useGetGroups({
    page: 1,
    size: 100,
  });

  const [formData, setFormData] = useState({
    group_name: group.group_name,
    group_type: group.group_type as
      | "COMPANY"
      | "DEPARTMENT"
      | "TEAM"
      | "PERSONAL",
    description: group.description || "",
    parent_group_id: group.parent_group_id || null,
    manager: group.manager || null,
    role_id: group.role_id || null,
    child_group_ids: [] as number[],
  });

  // 하위 그룹 초기값 설정
  useEffect(() => {
    if (groupsData?.items) {
      // 현재 그룹의 하위 그룹 ID 목록을 초기값으로 설정
      const childGroupIds = groupsData.items
        .filter((g) => g.parent_group_id === group.id)
        .map((g) => g.id);
      setFormData((prev) => ({
        ...prev,
        child_group_ids: childGroupIds,
      }));
    }
  }, [groupsData, group.id]);

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
        description: formData.description || null,
        parent_group_id: formData.parent_group_id || null,
        manager: formData.manager || null,
        role_id: formData.role_id || null,
        child_group_ids:
          formData.child_group_ids.length > 0 ? formData.child_group_ids : null,
      },
    });
  };

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
            <Link href={`/groups/${group.id}`}>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
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

                  {/* Role */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="role_id"
                      className="flex items-center gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      <span>역할</span>
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
                        <SelectValue placeholder="역할 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">미지정</SelectItem>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.role_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="space-y-2 md:col-span-2">
                    <Label
                      htmlFor="description"
                      className="flex items-center gap-2"
                    >
                      <Building2 className="h-4 w-4" />
                      <span>설명</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="그룹에 대한 설명을 입력하세요"
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 계층 Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderTree className="h-5 w-5" />
                그룹 계층 구조
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                그룹 간의 상하위 관계를 설정합니다
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8 md:grid-cols-2">
                {/* 상위 그룹 */}
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-2 text-base font-semibold">
                      <FolderTree className="h-4 w-4 text-primary" />
                      상위 그룹
                    </Label>
                    <p className="text-xs text-muted-foreground pl-6">
                      이 그룹이 속할 상위 그룹을 선택하세요. 선택하지 않으면
                      최상위 그룹으로 설정됩니다.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <ParentGroupSelect
                      value={formData.parent_group_id ?? undefined}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          parent_group_id: value ?? null,
                        })
                      }
                      excludeId={group.id}
                    />
                  </div>
                </div>

                {/* 하위 그룹 */}
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-2 text-base font-semibold">
                      <Network className="h-4 w-4 text-primary" />
                      하위 그룹
                    </Label>
                    <p className="text-xs text-muted-foreground pl-6">
                      이 그룹의 하위 그룹으로 포함할 그룹을 다중 선택하세요.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <ChildGroupsSelect
                      value={formData.child_group_ids}
                      onClick={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          child_group_ids: value,
                        }))
                      }
                      excludeGroupId={group.id}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 관리 정보 Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                관리자
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ManagerSelect
                value={formData.manager ?? undefined}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    manager: value ?? null,
                  })
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
