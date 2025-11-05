"use client";

import { useState, FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePatchGroup } from "../hooks/usePatchGroup";
import { useGetRoles } from "@/feature/users/hooks/useGetRoles";
import ParentGroupSelect from "../components/ParentGroupSelect";
import ManagerSelect from "../components/ManagerSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import {
  Building2,
  ArrowLeft,
  Save,
  FolderTree,
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

          {/* 상위 그룹 Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderTree className="h-5 w-5" />
                상위 그룹
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ParentGroupSelect
                value={formData.parent_group_id ?? undefined}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    parent_group_id: value ?? null,
                  })
                }
              />
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
