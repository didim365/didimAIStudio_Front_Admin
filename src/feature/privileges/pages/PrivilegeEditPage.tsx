"use client";

import { useState, FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePutPrivilege } from "../hooks/usePutPrivilege";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import {
  Shield,
  Key,
  FileText,
  Database,
  Zap,
  ArrowLeft,
  Save,
  Hash,
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
  ACTION_TYPE_VARIANTS,
  ACTION_TYPE_LABELS,
  ACTION_TYPE_COLORS,
  ACTION_TYPE_OPTIONS,
} from "../constants/actionType";
import { GetPrivilegeResponse } from "../api/getPrivilege";

interface PrivilegeEditPageProps {
  privilege: GetPrivilegeResponse;
}

function PrivilegeEditPage({ privilege }: PrivilegeEditPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<{
    privilege_name: string;
    description: string;
    resource_type: string;
    action_type: string;
  }>({
    privilege_name: privilege.privilege_name || "",
    description: privilege.description || "",
    resource_type: privilege.resource_type || "",
    action_type: privilege.action_type || "",
  });

  const { mutate: updatePrivilege, isPending: isUpdating } = usePutPrivilege({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["privileges"],
      });

      router.push(`/privileges/${privilege.id}`);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updatePrivilege({
      params: { privilege_id: privilege.id },
      data: {
        privilege_name: formData.privilege_name,
        description: formData.description || null,
        resource_type: formData.resource_type,
        action_type: formData.action_type as
          | "READ"
          | "WRITE"
          | "EXECUTE"
          | "DELETE"
          | "UPDATE"
          | "PATCH",
      },
    });
  };

  if (!privilege) {
    return (
      <div className="py-8 px-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              권한을 찾을 수 없습니다.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const actionTypeColor =
    ACTION_TYPE_COLORS[formData.action_type] ||
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
              onClick={() => router.push(`/privileges/${privilege.id}`)}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                권한 정보 수정
              </h1>
              <p className="text-muted-foreground">권한 ID: {privilege.id}</p>
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
          {/* Privilege Info Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                권한 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Icon Preview */}
                <div className="flex flex-col items-center gap-4">
                  <div className="h-32 w-32 border-4 border-background shadow-lg rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Shield className="h-16 w-16 text-primary" />
                  </div>
                  <Badge className={`${actionTypeColor} border`}>
                    {ACTION_TYPE_LABELS[formData.action_type] ||
                      formData.action_type}
                  </Badge>
                </div>

                {/* Privilege Form Grid */}
                <div className="flex-1 grid gap-4 md:grid-cols-2">
                  {/* Privilege Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="privilege_name"
                      className="flex items-center gap-2"
                    >
                      <Key className="h-4 w-4" />
                      <span>권한명 *</span>
                    </Label>
                    <Input
                      id="privilege_name"
                      value={formData.privilege_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          privilege_name: e.target.value,
                        })
                      }
                      placeholder="권한명을 입력하세요"
                      required
                    />
                  </div>

                  {/* Resource Type */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="resource_type"
                      className="flex items-center gap-2"
                    >
                      <Database className="h-4 w-4" />
                      <span>리소스 타입 *</span>
                    </Label>
                    <Input
                      id="resource_type"
                      value={formData.resource_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          resource_type: e.target.value,
                        })
                      }
                      placeholder="예: users, roles, groups"
                      required
                    />
                  </div>

                  {/* Action Type */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="action_type"
                      className="flex items-center gap-2"
                    >
                      <Zap className="h-4 w-4" />
                      <span>액션 타입 *</span>
                    </Label>
                    <Select
                      value={formData.action_type}
                      onValueChange={(value) =>
                        setFormData({ ...formData, action_type: value })
                      }
                      required
                    >
                      <SelectTrigger id="action_type" className="w-full">
                        <SelectValue placeholder="액션 타입 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {ACTION_TYPE_OPTIONS.map((option) => {
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

                  {/* Description */}
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
                      placeholder="권한에 대한 설명을 입력하세요"
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privilege Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                리소스 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Resource Type */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <span>리소스 타입</span>
                </div>
                <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                  <p className="text-sm font-mono">
                    {formData.resource_type || "리소스"}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Action Type */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <span>액션 타입</span>
                </div>
                <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                  <Badge
                    variant={
                      ACTION_TYPE_VARIANTS[formData.action_type] || "default"
                    }
                  >
                    {ACTION_TYPE_LABELS[formData.action_type] ||
                      formData.action_type}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                추가 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Privilege ID Display */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span>권한 식별자</span>
                </div>
                <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                  <p className="text-sm font-mono">#{privilege.id}</p>
                </div>
              </div>

              <Separator />

              {/* Current Values */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>현재 권한 요약</span>
                </div>
                <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                  <p className="text-sm">
                    <span className="font-semibold">
                      {formData.resource_type || "리소스"}
                    </span>{" "}
                    에 대한{" "}
                    <Badge
                      variant={
                        ACTION_TYPE_VARIANTS[formData.action_type] || "default"
                      }
                      className="mx-1"
                    >
                      {ACTION_TYPE_LABELS[formData.action_type] ||
                        formData.action_type}
                    </Badge>{" "}
                    권한
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}

export default PrivilegeEditPage;
