"use client";

import { useState, FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePatchGroup } from "../_hooks/usePatchGroup";
import GroupSelect from "../../../_components/GroupSelect";
import ManagerSelect from "../../../_components/ManagerSelect";
import { Card, CardContent } from "@/shared/ui/card";
import {
  Building2,
  ArrowLeft,
  Save,
  FolderTree,
  Shield,
  Network,
  Users,
  UserCog,
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
import { GROUP_TYPE_OPTIONS } from "../../../_constants/groupType";
import { GetGroupResponse } from "../../_api/getGroup";
import { PatchGroupRequest } from "../_api/patchGroup";
import { GetRolesResponse } from "@/feature/roles/_api/getRoles";
import Link from "next/link";
import { Alert, AlertDescription } from "@/shared/ui/alert";

export function GroupEditPage({
  group,
  roles,
}: {
  group: GetGroupResponse;
  roles: GetRolesResponse;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<
    Omit<PatchGroupRequest, "child_group_ids"> & { child_group_ids: number[] }
  >({
    group_name: group.group_name,
    group_type: group.group_type,
    description: group.description || "",
    parent_group_id: group.parent_group_id || null,
    manager: group.manager || null,
    role_id: group.role_id || null,
    child_group_ids: group.child_groups?.map((g) => g.id) || [],
  });

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
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Users className="h-8 w-8" />
                그룹 정보 수정
              </h1>
              <p className="text-muted-foreground mt-1">
                그룹 정보를 수정합니다
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" className="shrink-0" disabled={isUpdating}>
              <Save className="h-4 w-4 mr-2" />
              {isUpdating ? "저장 중..." : "저장"}
            </Button>
          </div>
        </div>

        {/* Main Content - 통합 Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {/* 기본 정보 섹션 */}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">기본 정보</h3>
                  <p className="text-sm text-muted-foreground">
                    그룹의 기본적인 정보를 수정합니다
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* 첫 번째 행: 그룹명, 그룹 타입, 역할 */}
                <div className="grid gap-4 md:grid-cols-3">
                  {/* 그룹명 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="group_name"
                      className="flex items-center gap-2"
                    >
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>그룹명 *</span>
                    </Label>
                    <Input
                      id="group_name"
                      value={formData.group_name ?? ""}
                      onChange={(e) =>
                        setFormData({ ...formData, group_name: e.target.value })
                      }
                      placeholder="예: 개발팀"
                      required
                    />
                  </div>

                  {/* 그룹 타입 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="group_type"
                      className="flex items-center gap-2"
                    >
                      <Network className="h-4 w-4 text-muted-foreground" />
                      <span>그룹 타입 *</span>
                    </Label>
                    <Select
                      value={formData.group_type ?? undefined}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          group_type: value as PatchGroupRequest["group_type"],
                        })
                      }
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
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 역할 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="role_id"
                      className="flex items-center gap-2"
                    >
                      <Shield className="h-4 w-4 text-muted-foreground" />
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
                            <div className="flex flex-col items-start">
                              <span className="font-medium">
                                {role.role_name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {role.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 두 번째 행: 설명 */}
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="flex items-center gap-2"
                  >
                    <span>설명</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    placeholder="그룹에 대한 설명을 입력하세요"
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 구분선 */}
            <div className="border-t border-border" />

            {/* 관리자 및 그룹 계층 구조 섹션 */}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10">
                  <FolderTree className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    관리자 및 그룹 계층 구조
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    그룹 관리자와 상하위 관계를 설정합니다
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {/* 관리자 */}
                <div className="space-y-3 flex flex-col">
                  <div className="flex items-center gap-2">
                    <UserCog className="h-4 w-4 text-muted-foreground" />
                    <Label className="font-medium">관리자</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    그룹을 관리할 담당자를 지정합니다.
                  </p>
                  <div className="border rounded-lg p-4 bg-muted/20 flex-1">
                    <ManagerSelect
                      value={formData.manager ?? undefined}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          manager: value ?? null,
                        })
                      }
                    />
                  </div>
                </div>

                {/* 상위 그룹 */}
                <div className="space-y-3 flex flex-col">
                  <div className="flex items-center gap-2">
                    <FolderTree className="h-4 w-4 text-muted-foreground" />
                    <Label className="font-medium">상위 그룹</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    이 그룹이 속할 상위 그룹을 선택하세요. 선택하지 않으면
                    최상위 그룹으로 설정됩니다.
                  </p>
                  <div className="border rounded-lg p-4 bg-muted/20 flex-1">
                    <GroupSelect
                      value={formData.parent_group_id ?? undefined}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          parent_group_id:
                            (value as number | undefined) ?? null,
                        })
                      }
                      multiSelect={false}
                      excludeId={group.id}
                    />
                  </div>
                </div>

                {/* 하위 그룹 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Network className="h-4 w-4 text-muted-foreground" />
                    <Label className="font-medium">하위 그룹</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    이 그룹의 하위 그룹으로 포함할 그룹을 다중 선택하세요.
                  </p>
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <GroupSelect
                      value={formData.child_group_ids}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          child_group_ids: (value as number[]) || [],
                        }))
                      }
                      multiSelect={true}
                      excludeId={group.id}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Alert */}
        <Alert>
          <AlertDescription className="flex items-center gap-2">
            <span className="text-sm">
              * 표시된 필드는 필수 입력 항목입니다.
            </span>
          </AlertDescription>
        </Alert>
      </div>
    </form>
  );
}
