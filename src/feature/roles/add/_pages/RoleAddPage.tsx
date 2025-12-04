"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { usePostRole } from "../_hooks/usePostRole";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { Shield, ArrowLeft, Save, ShieldPlus, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/shared/ui/alert";

export default function RoleAddPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    role_name: "",
    description: "",
  });

  // 역할 생성 mutation
  const { mutate: createRole, isPending: isCreating } = usePostRole({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
      // 역할 목록 페이지로 이동
      router.push("/roles");
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createRole({
      role_name: formData.role_name,
      description: formData.description || null,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/roles">
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
                <ShieldPlus className="h-8 w-8" />새 역할 추가
              </h1>
              <p className="text-muted-foreground mt-1">
                새로운 시스템 역할을 생성합니다
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" className="shrink-0" disabled={isCreating}>
              <Save className="h-4 w-4 mr-2" />
              {isCreating ? "생성 중..." : "역할 생성"}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6">
          {/* 기본 정보 Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* 역할명 */}
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
                    placeholder="예: 관리자, 매니저, 사용자"
                    className="pl-6"
                    required
                    maxLength={50}
                  />
                  <p className="text-xs text-muted-foreground">
                    역할의 이름을 입력하세요 (최대 50자)
                  </p>
                </div>

                {/* 설명 */}
                <div className="space-y-2">
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
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="역할에 대한 설명을 입력하세요"
                    className="pl-6 min-h-96 h-full"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground">
                    역할의 목적과 역할 범위를 설명하세요 (최대 500자, 선택사항)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Alert */}
          <Alert>
            <AlertDescription className="flex items-center gap-2">
              <span className="text-sm">
                * 표시된 필드는 필수 입력 항목입니다. 역할 생성 후 추가 설정은
                역할 상세 페이지에서 수정할 수 있습니다.
              </span>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </form>
  );
}
