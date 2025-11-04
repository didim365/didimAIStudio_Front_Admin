"use client";

import { useState, FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePatchUser } from "../hooks/usePatchUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Separator } from "@/shared/ui/separator";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Activity,
  Settings,
  UserCircle,
  Image as ImageIcon,
  ArrowLeft,
  Save,
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
import { formatDate } from "@/shared/utils/formatDate";
import { getInitials } from "@/feature/users/utils/getInitials";
import { formatPhoneNumber } from "@/feature/users/utils/formatPhoneNumber";
import { GetUserResponse } from "../api/getUser";

export function UserEditPage({ user }: { user: GetUserResponse }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    email: user.email || "",
    full_name: user.full_name || "",
    phone_number: user.phone || "",
    status: user.status as "ACTIVE" | "INACTIVE" | "SUSPENDED",
    preferences: user.preferences || {},
  });

  const { mutate: updateUser, isPending: isUpdating } = usePatchUser({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      router.push(`/users/${user.id}`);
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 전화번호에서 숫자만 추출하여 전송
    const phoneDigits = formData.phone_number
      ? formData.phone_number.replace(/\D/g, "")
      : null;

    updateUser({
      user_id: user.id,
      email: formData.email || null,
      full_name: formData.full_name || null,
      phone_number: phoneDigits || null,
      status: formData.status || null,
      preferences: formData.preferences,
    });
  };

  if (!user) {
    return (
      <div className="py-8 px-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              사용자를 찾을 수 없습니다.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              onClick={() => router.push("/users")}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                사용자 정보 수정
              </h1>
              <p className="text-muted-foreground">사용자 ID: {user.id}</p>
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
          {/* Profile Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                프로필 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                    <AvatarImage src={user.profile_image_url || undefined} />
                    <AvatarFallback className="text-3xl">
                      {getInitials(user.full_name, user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <Badge className="bg-muted text-muted-foreground hover:bg-muted/80">
                    {user.status}
                  </Badge>
                </div>

                {/* User Info Grid */}
                <div className="flex-1 grid gap-4 md:grid-cols-2">
                  {/* Full Name */}
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
                      placeholder="이름을 입력하세요"
                      className="pl-6"
                      required
                    />
                  </div>

                  {/* Email */}
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
                      placeholder="이메일을 입력하세요"
                      className="pl-6"
                      required
                    />
                  </div>

                  {/* Phone */}
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

                  {/* Status */}
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
                  <span>계정 생성일</span>
                </div>
                <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                  <p className="text-sm font-mono">
                    {formatDate(user.created_at)}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Updated At */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>마지막 업데이트</span>
                </div>
                <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                  <p className="text-sm font-mono">
                    {formatDate(user.updated_at)}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Last Login */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>마지막 로그인</span>
                </div>
                <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                  <p className="text-sm font-mono">
                    {formatDate(user.last_login)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                추가 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Image URL */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  <span>프로필 이미지 URL</span>
                </div>
                <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                  {user.profile_image_url ? (
                    <p className="text-sm font-mono break-all">
                      {user.profile_image_url}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      프로필 이미지가 설정되지 않았습니다
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Preferences */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span>사용자 설정</span>
                </div>
                <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                  {user.preferences &&
                  Object.keys(user.preferences).length > 0 ? (
                    <pre className="text-sm font-mono overflow-x-auto">
                      {JSON.stringify(user.preferences, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      설정된 값이 없습니다
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
