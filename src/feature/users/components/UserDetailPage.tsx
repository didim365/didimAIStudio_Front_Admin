"use client";

import { useGetUser } from "../hooks/useGetUser";
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
  ArrowLeft
} from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Button } from "@/shared/ui/button";
import { useRouter } from "next/navigation";

interface UserDetailPageProps {
  userId: string;
}

export function UserDetailPage({ userId }: UserDetailPageProps) {
  const router = useRouter();
  const { data: user, isLoading, error } = useGetUser({ user_id: Number(userId) });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 space-y-6">
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
      <div className="container mx-auto py-8 px-4">
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
      <div className="container mx-auto py-8 px-4">
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

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "정보 없음";
    try {
      return format(new Date(dateString), "PPP HH:mm:ss", { locale: ko });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "INACTIVE":
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
      case "SUSPENDED":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      default:
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
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

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard/users")}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">사용자 상세 정보</h1>
          <p className="text-muted-foreground">
            사용자 ID: {user.id}
          </p>
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
                <Badge className={getStatusColor(user.status)}>
                  {user.status}
                </Badge>
              </div>

              {/* User Info Grid */}
              <div className="flex-1 grid gap-4 md:grid-cols-2">
                {/* Full Name */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="font-medium">이름</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    {user.full_name || "정보 없음"}
                  </p>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="font-medium">이메일</span>
                  </div>
                  <p className="text-lg font-semibold pl-6 break-all">
                    {user.email}
                  </p>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span className="font-medium">전화번호</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    {user.phone || "정보 없음"}
                  </p>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Activity className="h-4 w-4" />
                    <span className="font-medium">사용자 ID</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    #{user.id}
                  </p>
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
                <Calendar className="h-4 w-4 text-blue-500" />
                <span>계정 생성일</span>
              </div>
              <div className="ml-6 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                <p className="text-sm font-mono">{formatDate(user.created_at)}</p>
              </div>
            </div>

            <Separator />

            {/* Updated At */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-purple-500" />
                <span>마지막 업데이트</span>
              </div>
              <div className="ml-6 p-3 bg-purple-500/5 rounded-lg border border-purple-500/20">
                <p className="text-sm font-mono">{formatDate(user.updated_at)}</p>
              </div>
            </div>

            <Separator />

            {/* Last Login */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-green-500" />
                <span>마지막 로그인</span>
              </div>
              <div className="ml-6 p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                <p className="text-sm font-mono">{formatDate(user.last_login)}</p>
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
                <ImageIcon className="h-4 w-4 text-amber-500" />
                <span>프로필 이미지 URL</span>
              </div>
              <div className="ml-6 p-3 bg-amber-500/5 rounded-lg border border-amber-500/20">
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
                <Settings className="h-4 w-4 text-indigo-500" />
                <span>사용자 설정</span>
              </div>
              <div className="ml-6 p-3 bg-indigo-500/5 rounded-lg border border-indigo-500/20">
                {user.preferences && Object.keys(user.preferences).length > 0 ? (
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

      {/* Raw Data Card (for debugging/admin purposes) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            전체 데이터 (개발자용)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm font-mono">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

