"use client";

import { useState, FormEvent, useEffect } from "react";
import { useGetUser } from "../hooks/useGetUser";
import { usePatchUser } from "../hooks/usePatchUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
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
  X,
} from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
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
import Link from "next/link";

interface UserEditPageProps {
  userId: string;
}

export function UserEditPage({ userId }: UserEditPageProps) {
  const router = useRouter();
  const {
    data: user,
    isLoading,
    error,
  } = useGetUser({ user_id: Number(userId) });

  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    phone_number: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE" | "SUSPENDED",
    role_id: null as number | null,
    preferences: null as Record<string, never> | null,
  });

  useEffect(() => {
    if (user) {
      const validStatuses = ["ACTIVE", "INACTIVE", "SUSPENDED"] as const;
      const status =
        user.status && validStatuses.includes(user.status as any)
          ? (user.status as "ACTIVE" | "INACTIVE" | "SUSPENDED")
          : "ACTIVE";

      setFormData({
        email: user.email || "",
        full_name: user.full_name || "",
        phone_number: user.phone || "",
        status,
        role_id: null, // role_id is not in user response, keeping null
        preferences: user.preferences || null,
      });
    }
  }, [user]);

  const { mutate: updateUser, isPending: isUpdating } = usePatchUser({
    onSuccess: () => {
      router.push(`/dashboard/users/${userId}`);
    },
    onError: (error) => {
      console.error("사용자 업데이트 오류:", error);
      alert("사용자 정보 업데이트 중 오류가 발생했습니다.");
    },
  });

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "정보 없음";
    try {
      return format(new Date(dateString), "PPP HH:mm:ss", { locale: ko });
    } catch {
      return dateString;
    }
  };

  const getInitials = (name: string | null | undefined, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email[0].toUpperCase();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateUser({
      user_id: Number(userId),
      email: formData.email || null,
      full_name: formData.full_name || null,
      phone_number: formData.phone_number || null,
      status: formData.status || null,
      role_id: formData.role_id,
      preferences: formData.preferences,
    });
  };

  const handleCancel = () => {
    router.push(`/dashboard/users/${userId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 px-4">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">오류 발생</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              사용자 정보를 불러오는 중 오류가 발생했습니다.
            </p>
            <p className="text-sm text-destructive mt-2">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              onClick={() => router.push("/dashboard/users")}
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
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="shrink-0"
              disabled={isUpdating}
            >
              <X className="h-4 w-4 mr-2" />
              취소
            </Button>
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
                      <span>이름</span>
                    </Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      placeholder="이름을 입력하세요"
                      className="pl-6"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>이메일</span>
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
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone_number"
                      className="flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      <span>전화번호</span>
                    </Label>
                    <Input
                      id="phone_number"
                      type="tel"
                      value={formData.phone_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone_number: e.target.value,
                        })
                      }
                      placeholder="전화번호를 입력하세요"
                      className="pl-6"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status" className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      <span>상태</span>
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(
                        value: "ACTIVE" | "INACTIVE" | "SUSPENDED"
                      ) => setFormData({ ...formData, status: value })}
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
