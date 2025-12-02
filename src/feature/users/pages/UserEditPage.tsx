"use client";

import { useState, FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePatchUser } from "../hooks/usePatchUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
  User,
  Mail,
  Phone,
  Activity,
  UserCircle,
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
import { getInitials } from "@/feature/users/utils/getInitials";
import { formatPhoneNumber } from "@/feature/users/utils/formatPhoneNumber";
import { GetUserResponse } from "../api/getUser";
import Link from "next/link";

export function UserEditPage({ user }: { user: GetUserResponse }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    email: user.email || "",
    full_name: user.full_name || "",
    phone_number: formatPhoneNumber(user.phone),
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
    // formatPhoneNumber가 "-"를 반환하는 경우 빈 문자열로 처리
    const phoneValue = formatted === "-" ? "" : formatted;

    setFormData({
      ...formData,
      phone_number: phoneValue,
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

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={`/users/${user.id}`}>
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
                  {/* Status Select */}
                  <div className="space-y-2 w-full">
                    <Label
                      htmlFor="status"
                      className="flex items-center gap-2 text-sm"
                    >
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
                      <SelectTrigger id="status" className="w-full">
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

                {/* User Info Grid */}
                <div className="flex-1 space-y-4">
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
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
