"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePostGroups } from "../_hooks/usePostGroups";
import { paths } from "@/shared/types/api/auth";
import { Card, CardContent } from "@/shared/ui/card";
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
import GroupSelect from "../../_components/GroupSelect";
import ManagerSelect from "../../_components/ManagerSelect";

import { GROUP_TYPE_OPTIONS } from "../../_constants/groupType";
import Link from "next/link";

type GroupType = "COMPANY" | "DEPARTMENT" | "TEAM" | "PERSONAL";

type GetMyInfoResponse =
  paths["/api/v1/users/me"]["get"]["responses"]["200"]["content"]["application/json"];

type GetRolesResponse =
  paths["/api/v1/roles/"]["get"]["responses"]["200"]["content"]["application/json"];

interface GroupAddPageProps {
  myInfo: GetMyInfoResponse;
  roles: GetRolesResponse;
}

export default function GroupAddPage({ myInfo, roles }: GroupAddPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    group_name: "",
    group_type: "COMPANY" as GroupType,
    description: "",
    parent_group_id: undefined as number | undefined,
    child_group_ids: [] as number[],
    manager: undefined as number | undefined,
    role_id: undefined as number | undefined,
  });

  // 그룹 생성 mutation
  const { mutate: createGroup, isPending: isCreating } = usePostGroups({
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
      router.push(`/groups/${data.id}`);
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
      description: formData.description || null,
      parent_group_id: formData.parent_group_id || null,
      child_group_ids:
        formData.child_group_ids.length > 0 ? formData.child_group_ids : null,
      manager: formData.manager || null,
      role_id: formData.role_id,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={"/groups"}>
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
                <Users className="h-8 w-8" />새 그룹 추가
              </h1>
              <p className="text-muted-foreground mt-1">
                새로운 그룹을 생성합니다
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" className="shrink-0" disabled={isCreating}>
              <Save className="h-4 w-4 mr-2" />
              {isCreating ? "생성 중..." : "그룹 생성"}
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
                    그룹의 기본적인 정보를 입력합니다
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
                      value={formData.group_name}
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
                      value={formData.group_type}
                      onValueChange={(value: GroupType) =>
                        setFormData({ ...formData, group_type: value })
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
                      <span>역할 *</span>
                    </Label>
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
                      <SelectTrigger id="role_id" className="w-full">
                        <SelectValue placeholder="역할 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles?.map((role) => (
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
                    value={formData.description}
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
                  <h3 className="text-lg font-semibold">관리자 및 그룹 계층 구조</h3>
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
                      value={formData.manager}
                      onChange={(value) =>
                        setFormData({ ...formData, manager: value })
                      }
                    />
                  </div>
                </div>

                {/* 상위 그룹 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FolderTree className="h-4 w-4 text-muted-foreground" />
                    <Label className="font-medium">상위 그룹</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    이 그룹이 속할 상위 그룹을 선택하세요. 선택하지 않으면
                    최상위 그룹으로 생성됩니다.
                  </p>
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <GroupSelect
                      value={formData.parent_group_id}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          parent_group_id: value as number | undefined,
                        })
                      }
                      multiSelect={false}
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
              * 표시된 필드는 필수 입력 항목입니다. 그룹 생성 후 추가 정보는
              그룹 상세 페이지에서 수정할 수 있습니다.
            </span>
          </AlertDescription>
        </Alert>
      </div>
    </form>
  );
}
