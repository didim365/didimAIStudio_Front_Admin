"use client";

import { useState, FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { usePutUserConfig } from "../_hooks/usePutUserConfig";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  Settings,
  ArrowLeft,
  Save,
  Server,
  Key,
  Wrench,
  Activity,
  CheckCircle2,
  XCircle,
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
import Link from "next/link";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { GetUserConfigResponse } from "../../_api/getUserConfig";
import { Badge } from "@/shared/ui/badge";

interface ToolEditPageProps {
  config: GetUserConfigResponse;
}

export function ToolEditPage({ config }: ToolEditPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    config_name: config.config_name || "",
    is_active: config.is_active ?? true,
    server_configText: JSON.stringify(config.server_config || {}, null, 2),
    secretsText: config.has_secrets ? "{}" : "{}",
  });

  const { mutate: updateConfig, isPending: isUpdating } = usePutUserConfig({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-configs"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-config", config.config_id],
      });

      toast.success("설정이 성공적으로 수정되었습니다.");
      router.push(`/studio/data/tools/${config.config_id}`);
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error("설정 수정 중 오류가 발생했습니다.");
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // JSON 파싱 및 검증
    let server_config: Record<string, unknown> | null = null;
    try {
      const trimmedText = formData.server_configText.trim();
      if (trimmedText) {
        const parsed = JSON.parse(trimmedText);
        if (typeof parsed === "object" && parsed !== null) {
          server_config = parsed as Record<string, unknown>;
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("서버 설정 JSON 형식이 올바르지 않습니다.");
      return;
    }

    let secrets: Record<string, unknown> | null = null;
    try {
      const trimmedText = formData.secretsText.trim();
      if (trimmedText) {
        const parsed = JSON.parse(trimmedText);
        if (typeof parsed === "object" && parsed !== null) {
          secrets = parsed as Record<string, unknown>;
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("민감정보 JSON 형식이 올바르지 않습니다.");
      return;
    }

    updateConfig({
      params: { config_id: config.config_id },
      data: {
        config_name: formData.config_name || null,
        is_active: formData.is_active,
        server_config: server_config || {},
        secrets: secrets && Object.keys(secrets).length > 0 ? secrets : null,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={`/studio/data/tools/${config.config_id}`}>
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
                도구 설정 수정
              </h1>
              <p className="text-muted-foreground">
                설정 ID: {config.config_id} | 도구 ID: {config.tool_id}
              </p>
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
          {/* Basic Info Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Config Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="config_name"
                    className="flex items-center gap-2"
                  >
                    <Wrench className="h-4 w-4" />
                    <span>설정 이름 *</span>
                  </Label>
                  <Input
                    id="config_name"
                    value={formData.config_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        config_name: e.target.value,
                      })
                    }
                    placeholder="설정 이름을 입력하세요"
                    className="pl-6"
                    required
                  />
                </div>

                {/* User ID (Read-only) */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-muted-foreground">
                    <Activity className="h-4 w-4" />
                    <span>사용자 ID</span>
                  </Label>
                  <div className="pl-6">
                    <Badge variant="outline" className="text-sm font-normal">
                      {config.user_id}
                    </Badge>
                  </div>
                </div>

                {/* Tool ID (Read-only) */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-muted-foreground">
                    <Wrench className="h-4 w-4" />
                    <span>도구 ID</span>
                  </Label>
                  <div className="pl-6">
                    <Badge variant="outline" className="text-sm font-normal">
                      {config.tool_id}
                    </Badge>
                  </div>
                </div>

                {/* Tool Name (Read-only) */}
                {config.tool_name && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-muted-foreground">
                      <Wrench className="h-4 w-4" />
                      <span>도구 이름</span>
                    </Label>
                    <div className="pl-6">
                      <Badge variant="outline" className="text-sm font-normal">
                        {config.tool_name}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Active Status */}
                <div className="space-y-2">
                  <Label
                    htmlFor="is_active"
                    className="flex items-center gap-2"
                  >
                    <Activity className="h-4 w-4" />
                    <span>활성 상태 *</span>
                  </Label>
                  <Select
                    value={formData.is_active ? "true" : "false"}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        is_active: value === "true",
                      })
                    }
                    required
                  >
                    <SelectTrigger id="is_active" className="w-full pl-6">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          활성
                        </div>
                      </SelectItem>
                      <SelectItem value="false">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-gray-500" />
                          비활성
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Server Config Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                서버 설정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Server className="h-4 w-4 text-muted-foreground" />
                  <span>서버 설정 정보 (JSON)</span>
                </Label>
                <div className="ml-6">
                  <div className="border rounded-lg overflow-hidden">
                    <CodeMirror
                      value={formData.server_configText}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          server_configText: value,
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
                      placeholder='{\n  "host": "localhost",\n  "port": 8080\n}'
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

          {/* Secrets Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                민감정보 (Secrets)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <span>민감정보 설정 (JSON)</span>
                </Label>
                <div className="ml-6">
                  <div className="border rounded-lg overflow-hidden">
                    <CodeMirror
                      value={formData.secretsText}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          secretsText: value,
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
                      placeholder='{\n  "api_key": "your-api-key",\n  "password": "your-password"\n}'
                      minHeight="200px"
                      maxHeight="400px"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    JSON 형식으로 입력하세요. 빈 객체 {}로 두면 민감정보가
                    제거됩니다.
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

export default ToolEditPage;
