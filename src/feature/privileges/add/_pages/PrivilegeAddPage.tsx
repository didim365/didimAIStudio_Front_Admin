"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePostPrivilege } from "../_hooks/usePostPrivilege";
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
  ArrowLeft,
  Save,
  Shield,
  Key,
  Database,
  FileText,
  Info,
} from "lucide-react";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import {
  ACTION_TYPE_OPTIONS,
  ACTION_TYPE_LABELS,
  ACTION_TYPE_VARIANTS,
} from "../../_constants/actionType";

type ActionType = "READ" | "WRITE" | "EXECUTE" | "DELETE" | "UPDATE" | "PATCH";

function PrivilegeAddPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    privilege_name: "",
    description: "",
    resource_type: "",
    action_type: "READ" as ActionType,
  });

  // 권한 생성 mutation
  const { mutate: createPrivilege, isPending: isCreating } = usePostPrivilege({
    onSuccess: (data) => {
      toast.success("권한이 성공적으로 생성되었습니다.");
      queryClient.invalidateQueries({
        queryKey: ["privileges"],
      });
      router.push(`/privileges/${data.id}`);
    },
    onError: (error) => {
      toast.error("권한 생성에 실패했습니다.");
      console.error("Error creating privilege:", error);
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleActionTypeChange = (value: ActionType) => {
    setFormData((prev) => ({ ...prev, action_type: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.privilege_name.trim()) {
      toast.error("권한명을 입력해주세요.");
      return;
    }

    if (!formData.resource_type.trim()) {
      toast.error("리소스 타입을 입력해주세요.");
      return;
    }

    createPrivilege({
      privilege_name: formData.privilege_name,
      description: formData.description || null,
      resource_type: formData.resource_type,
      action_type: formData.action_type,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/privileges">
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
                <Shield className="h-8 w-8" />새 권한 추가
              </h1>
              <p className="text-muted-foreground mt-1">
                새로운 권한을 생성합니다
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" className="shrink-0" disabled={isCreating}>
              <Save className="h-4 w-4 mr-2" />
              {isCreating ? "생성 중..." : "권한 생성"}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* 기본 정보 Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                권한 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* 권한명 */}
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
                    name="privilege_name"
                    value={formData.privilege_name}
                    onChange={handleInputChange}
                    placeholder="예: user.read, role.write"
                    className="pl-6"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    권한을 식별하는 고유한 이름을 입력하세요
                  </p>
                </div>

                {/* 리소스 타입 */}
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
                    name="resource_type"
                    value={formData.resource_type}
                    onChange={handleInputChange}
                    placeholder="예: users, roles, groups, privileges"
                    className="pl-6"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    권한이 적용될 리소스 타입을 입력하세요
                  </p>
                </div>

                {/* 액션 타입 */}
                <div className="space-y-2">
                  <Label
                    htmlFor="action_type"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>액션 타입 *</span>
                  </Label>
                  <Select
                    value={formData.action_type}
                    onValueChange={handleActionTypeChange}
                    required
                  >
                    <SelectTrigger id="action_type" className="pl-6 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTION_TYPE_OPTIONS.map((option) => {
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
                  <p className="text-xs text-muted-foreground">
                    수행할 작업 유형을 선택하세요
                  </p>
                </div>

                {/* 설명 */}
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="flex items-center gap-2"
                  >
                    <Info className="h-4 w-4" />
                    <span>설명</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="권한에 대한 설명을 입력하세요"
                    className="pl-6 min-h-[100px] resize-none"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    권한의 용도나 목적을 설명하세요 (선택 사항)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 권한 미리보기 Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                권한 미리보기
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 권한 요약 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>권한 요약</span>
                </div>
                <div className="ml-6 p-4 bg-muted rounded-lg border border-border">
                  <p className="text-sm leading-relaxed">
                    {formData.resource_type || "리소스"}{" "}
                    {formData.resource_type ? "에 대한" : "-"}{" "}
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
                  {formData.privilege_name && (
                    <p className="text-xs text-muted-foreground mt-2">
                      권한명:{" "}
                      <span className="font-mono">
                        {formData.privilege_name}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {/* 설명 미리보기 */}
              {formData.description && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Info className="h-4 w-4" />
                    <span>설명</span>
                  </div>
                  <div className="ml-6 p-4 bg-muted rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {formData.description}
                    </p>
                  </div>
                </div>
              )}

              {!formData.description && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Info className="h-4 w-4" />
                    <span>설명</span>
                  </div>
                  <div className="ml-6 p-4 bg-muted/50 rounded-lg border border-dashed border-border">
                    <p className="text-sm text-muted-foreground/50 italic">
                      설명이 입력되지 않았습니다
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Alert */}
        <Alert>
          <AlertDescription className="flex items-center gap-2">
            <span className="text-sm">
              * 표시된 필드는 필수 입력 항목입니다. 권한 생성 후 추가 정보는
              권한 상세 페이지에서 수정할 수 있습니다.
            </span>
          </AlertDescription>
        </Alert>
      </div>
    </form>
  );
}

export default PrivilegeAddPage;
