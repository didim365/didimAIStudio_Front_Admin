"use client";

import { useState, FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePutRole } from "../_hooks/usePutRole";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import {
  Shield,
  Calendar,
  ArrowLeft,
  Save,
  Hash,
  FileText,
  Clock,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/shared/utils/formatDate";
import { GetRoleResponse } from "../../_api/getRole";

export function RoleEditPage({ role }: { role: GetRoleResponse }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    role_name: role.role_name || "",
    description: role.description || "",
  });

  const { mutate: updateRole, isPending: isUpdating } = usePutRole({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });

      router.push(`/roles/${role.id}`);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateRole({
      params: { role_id: role.id },
      data: {
        role_name: formData.role_name,
        description: formData.description || null,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={`/roles/${role.id}`} className="shrink-0">
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
                역할 정보 수정
              </h1>
              <p className="text-muted-foreground">역할 ID: {role.id}</p>
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
          {/* Role Info Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                역할 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Icon Preview */}
                <div className="flex flex-col items-center gap-4">
                  <div className="h-32 w-32 border-4 border-background shadow-lg rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Shield className="h-16 w-16 text-primary" />
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                    역할
                  </Badge>
                </div>

                {/* Role Form Grid */}
                <div className="flex-1 gap-4 flex flex-col">
                  {/* Role Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="role_name"
                      className="flex items-center gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      <span>역할명 *</span>
                    </Label>
                    <Input
                      id="role_name"
                      value={formData.role_name}
                      onChange={(e) =>
                        setFormData({ ...formData, role_name: e.target.value })
                      }
                      placeholder="역할명을 입력하세요"
                      required
                    />
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
                      placeholder="역할에 대한 설명을 입력하세요"
                      rows={4}
                      className="resize-none"
                    />
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
                  <span>역할 생성일</span>
                </div>
                <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                  <p className="text-sm font-mono">
                    {formatDate(role.created_at)}
                  </p>
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
              {/* Role ID Display */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span>역할 식별자</span>
                </div>
                <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                  <p className="text-sm font-mono">#{role.id}</p>
                </div>
              </div>

              <Separator />

              {/* Role Name Display */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>역할 시스템 이름</span>
                </div>
                <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                  <p className="text-sm font-mono break-all">
                    {formData.role_name || role.role_name}
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
