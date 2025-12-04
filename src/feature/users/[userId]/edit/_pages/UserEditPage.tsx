"use client";

import { useState, FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePatchUser } from "../../_hooks/usePatchUser";
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
  Settings,
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
import { getInitials } from "@/feature/users/_utils/getInitials";
import { formatPhoneNumber } from "@/feature/users/_utils/formatPhoneNumber";
import { GetUserResponse } from "../../_api/getUser";
import Link from "next/link";
import { Separator } from "@/shared/ui/separator";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";
import { useTheme } from "next-themes";
import { toast } from "sonner";

export function UserEditPage({ user }: { user: GetUserResponse }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    email: user.email || "",
    full_name: user.full_name || "",
    phone: formatPhoneNumber(user.phone),
    status: user.status as "ACTIVE" | "INACTIVE" | "SUSPENDED",
    preferencesText: JSON.stringify(user.preferences || {}, null, 2),
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
      phone: phoneValue,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 전화번호에서 숫자만 추출하여 전송
    const phoneDigits = formData.phone.replace(/\D/g, "");

    // JSON 파싱 및 검증
    let preferences: Record<string, unknown> | null = null;
    try {
      const trimmedText = formData.preferencesText.trim();
      if (trimmedText) {
        const parsed = JSON.parse(trimmedText);
        if (typeof parsed === "object" && parsed !== null) {
          preferences = parsed as Record<string, unknown>;
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("사용자 개인설정 JSON 형식이 올바르지 않습니다.");
      return;
    }

    updateUser({
      user_id: user.id,
      email: formData.email || null,
      full_name: formData.full_name || null,
      phone: phoneDigits || null,
      status: formData.status || null,
      preferences:
        preferences && Object.keys(preferences).length > 0
          ? (preferences as Record<string, never>)
          : null,
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
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>전화번호</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handlePhoneNumberChange(e.target.value)}
                      placeholder="010-1234-5678"
                      className="pl-6"
                      maxLength={13}
                    />
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Preferences */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span>사용자 개인설정 (테마, 언어 등)</span>
                </Label>
                <div className="ml-6">
                  <div className="border rounded-lg overflow-hidden">
                    <CodeMirror
                      value={formData.preferencesText}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          preferencesText: value,
                        })
                      }
                      extensions={[json()]}
                      theme={theme === "dark" ? oneDark : undefined}
                      basicSetup={{
                        lineNumbers: true,
                        foldGutter: true,
                        dropCursor: false,
                        allowMultipleSelections: false,
                        indentOnInput: true,
                        bracketMatching: true,
                        closeBrackets: true,
                        autocompletion: true,
                        highlightSelectionMatches: false,
                      }}
                      placeholder='{\n  "theme": "dark",\n  "language": "ko"\n}'
                      minHeight="200px"
                      maxHeight="400px"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    JSON 형식으로 입력하세요. 탭 키로 들여쓰기가 가능합니다.
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
