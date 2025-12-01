"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePostUser } from "../hooks/usePostUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
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
import {
  User,
  Mail,
  Phone,
  Activity,
  ArrowLeft,
  Save,
  Lock,
  Shield,
  UserPlus,
} from "lucide-react";
import { formatPhoneNumber } from "@/feature/users/utils/formatPhoneNumber";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import type { GetRolesResponse } from "@/feature/roles/api/getRoles";

interface UserAddPageProps {
  roles: GetRolesResponse;
}

export function UserAddPage({ roles }: UserAddPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password_confirm: "",
    full_name: "",
    phone_number: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE" | "SUSPENDED",
    role_id: undefined as number | undefined,
  });

  const [passwordError, setPasswordError] = useState("");

  // 사용자 생성 mutation
  const { mutate: createUser, isPending: isCreating } = usePostUser({
    onSuccess: (data) => {
      toast.success("사용자가 성공적으로 생성되었습니다.");
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      // 생성된 사용자 상세 페이지로 이동
      router.push(`/users/${data.id}`);
    },
  });

  // 전화번호 입력 핸들러 - 입력 시 자동 포맷팅
  const handlePhoneNumberChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setFormData({
      ...formData,
      phone_number: formatted,
    });
  };

  // 비밀번호 검증
  const validatePasswords = (): boolean => {
    if (formData.password !== formData.password_confirm) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 비밀번호 검증
    if (!validatePasswords()) {
      return;
    }

    // 전화번호에서 숫자만 추출하여 전송
    const phoneDigits = formData.phone_number.replace(/\D/g, "");

    createUser({
      email: formData.email,
      password: formData.password,
      full_name: formData.full_name || null,
      phone: phoneDigits,
      status: formData.status,
      role_id: formData.role_id || null,
      preferences: null,
      last_login: null,
    });
  };

  const selectedRole = roles?.find((r) => r.id === formData.role_id);

  return (
    <div className="py-8 px-4">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/users">
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
                  <UserPlus className="h-8 w-8" />새 사용자 추가
                </h1>
                <p className="text-muted-foreground mt-1">
                  새로운 사용자 계정을 생성합니다
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button type="submit" className="shrink-0" disabled={isCreating}>
                <Save className="h-4 w-4 mr-2" />
                {isCreating ? "생성 중..." : "사용자 생성"}
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* 기본 정보 Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  기본 정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* 이름 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="full_name"
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      <span>이름 *</span>
                    </Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      placeholder="홍길동"
                      className="pl-6"
                      required
                    />
                  </div>

                  {/* 이메일 */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>이메일 *</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="user@example.com"
                      className="pl-6"
                      required
                    />
                  </div>

                  {/* 전화번호 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone_number"
                      className="flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      <span>전화번호 *</span>
                    </Label>
                    <Input
                      id="phone_number"
                      type="tel"
                      value={formData.phone_number}
                      onChange={(e) => handlePhoneNumberChange(e.target.value)}
                      placeholder="010-1234-5678"
                      className="pl-6"
                      maxLength={13}
                      required
                    />
                  </div>

                  {/* 상태 */}
                  <div className="space-y-2">
                    <Label htmlFor="status" className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      <span>상태 *</span>
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(
                        value: "ACTIVE" | "INACTIVE" | "SUSPENDED"
                      ) => setFormData({ ...formData, status: value })}
                      required
                    >
                      <SelectTrigger id="status" className="pl-6 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">활성</SelectItem>
                        <SelectItem value="INACTIVE">비활성</SelectItem>
                        <SelectItem value="SUSPENDED">정지</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 보안 정보 Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  보안 정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 비밀번호 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      <span>비밀번호 *</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        setPasswordError("");
                      }}
                      placeholder="최소 8자 이상"
                      className="pl-6"
                      minLength={8}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      최소 8자 이상의 비밀번호를 입력하세요
                    </p>
                  </div>

                  {/* 비밀번호 확인 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password_confirm"
                      className="flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      <span>비밀번호 확인 *</span>
                    </Label>
                    <Input
                      id="password_confirm"
                      type="password"
                      value={formData.password_confirm}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          password_confirm: e.target.value,
                        });
                        setPasswordError("");
                      }}
                      placeholder="비밀번호를 다시 입력하세요"
                      className="pl-6"
                      minLength={8}
                      required
                    />
                  </div>

                  {/* 비밀번호 에러 메시지 */}
                  {passwordError && (
                    <Alert variant="destructive">
                      <AlertDescription>{passwordError}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 역할 정보 Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  역할 정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 역할 선택 */}
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
                          role_id: value === "none" ? undefined : Number(value),
                        })
                      }
                    >
                      <SelectTrigger id="role_id" className="pl-6 w-full">
                        <SelectValue placeholder="역할을 선택하세요 (선택사항)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">역할 없음</SelectItem>
                        {roles?.map((role) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            <div className="flex flex-col items-start">
                              <span className="font-medium">
                                {role.role_name}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      사용자에게 할당할 역할을 선택하세요 (선택사항)
                    </p>
                  </div>

                  {/* 역할 정보 표시 */}
                  {selectedRole && (
                    <div className="p-4 bg-muted rounded-lg border border-border">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          <span className="font-semibold">
                            {selectedRole.role_name}
                          </span>
                        </div>
                        {selectedRole.description && (
                          <p className="text-sm text-muted-foreground">
                            {selectedRole.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Alert */}
          <Alert>
            <AlertDescription className="flex items-center gap-2">
              <span className="text-sm">
                * 표시된 필드는 필수 입력 항목입니다. 사용자 생성 후 추가 정보는
                사용자 상세 페이지에서 수정할 수 있습니다.
              </span>
            </AlertDescription>
          </Alert>
        </div>
      </form>
    </div>
  );
}
