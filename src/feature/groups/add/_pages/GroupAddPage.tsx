"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePostGroups } from "../_hooks/usePostGroups";
import { paths } from "@/shared/types/api/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
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
  FileText,
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

                {/* 생성자 (자동) */}
                <div className="space-y-2">
                  <Label htmlFor="creator" className="flex items-center gap-2">
                    <UserCog className="h-4 w-4" />
                    <span>생성자 *</span>
                  </Label>
                  <Input
                    id="creator"
                    value={myInfo.full_name || myInfo.email || ""}
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
                            <span className="text-xs text-muted-foreground">
                              {role.description}
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

                {/* 설명 */}
                <div className="space-y-2 md:col-span-2">
                  <Label
                    htmlFor="description"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
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
                      최상위 그룹으로 생성됩니다.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <GroupSelect
                      value={formData.parent_group_id}
                      onChange={(value) =>
                        setFormData({ ...formData, parent_group_id: value as number | undefined })
                      }
                      multiSelect={false}
                      showNoneOption={true}
                      showSelectedBadges={false}
                      helpText="* 폴더를 클릭하여 상위 그룹을 선택하세요."
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
                    <GroupSelect
                      value={formData.child_group_ids}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          child_group_ids: (value as number[]) || [],
                        }))
                      }
                      multiSelect={true}
                      showNoneOption={false}
                      showSelectedBadges={true}
                      helpText="* 폴더를 클릭하여 하위 그룹을 선택하세요. (다중 선택 가능)"
                      selectedLabel={`선택된 하위 그룹 (${formData.child_group_ids.length}개)`}
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
              <div className="space-y-4">
                {/* 관리자 */}
                <ManagerSelect
                  value={formData.manager}
                  onChange={(value) =>
                    setFormData({ ...formData, manager: value })
                  }
                />
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
