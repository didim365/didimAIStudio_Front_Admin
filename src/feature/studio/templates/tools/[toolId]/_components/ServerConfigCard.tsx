"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import {
  Settings,
  Key,
  ChevronDown,
  Braces,
  List,
  FileCode,
  Hash,
  Type,
  ToggleLeft,
  Database,
} from "lucide-react";
import { useState } from "react";
import { GetToolConfigResponse } from "../_api/getToolConfig";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { usePutToolConfig } from "../_hooks/usePutToolConfig";
import { paths } from "@/shared/types/api/tools";

type PutToolConfigRequest =
  paths["/v1/mcp-tools/{tool_id}/config"]["put"]["requestBody"]["content"]["application/json"];
import { useQueryClient } from "@tanstack/react-query";
import { Save, Loader2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";

interface ServerConfigCardProps {
  config: GetToolConfigResponse;
  toolId: number;
}

// 값 타입에 따른 아이콘 반환
const getValueIcon = (value: unknown) => {
  if (typeof value === "string") return Type;
  if (typeof value === "number") return Hash;
  if (typeof value === "boolean") return ToggleLeft;
  if (Array.isArray(value)) return List;
  if (typeof value === "object" && value !== null) return Braces;
  return FileCode;
};

// 값 타입에 따른 색상 반환
const getValueColor = (value: unknown) => {
  if (typeof value === "string") return "text-blue-600 dark:text-blue-400";
  if (typeof value === "number") return "text-green-600 dark:text-green-400";
  if (typeof value === "boolean") return "text-purple-600 dark:text-purple-400";
  if (Array.isArray(value)) return "text-orange-600 dark:text-orange-400";
  if (typeof value === "object" && value !== null)
    return "text-pink-600 dark:text-pink-400";
  return "text-gray-600 dark:text-gray-400";
};

// 값 타입에 따른 배경 색상 반환
const getValueBgColor = (value: unknown) => {
  if (typeof value === "string")
    return "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800";
  if (typeof value === "number")
    return "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800";
  if (typeof value === "boolean")
    return "bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800";
  if (Array.isArray(value))
    return "bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800";
  if (typeof value === "object" && value !== null)
    return "bg-pink-50/50 dark:bg-pink-950/20 border-pink-200 dark:border-pink-800";
  return "bg-gray-50/50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800";
};

// null 값과 빈 값들을 검증하는 함수
const isEmptyValue = (value: unknown): boolean => {
  if (value === null) return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (
    typeof value === "object" &&
    value !== null &&
    Object.keys(value).length === 0
  ) {
    return true;
  }
  return false;
};

// 값 렌더링 컴포넌트
const ConfigValue = ({
  value,
  onChange,
}: {
  value: unknown;
  onChange?: (newValue: unknown) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const { theme } = useTheme();
  const colorClass = getValueColor(value);
  const bgColorClass = getValueBgColor(value);

  const handleSave = () => {
    if (!onChange) return;
    try {
      let parsedValue: unknown = editValue;
      if (typeof value === "number") {
        parsedValue = Number(editValue);
      } else if (typeof value === "boolean") {
        parsedValue = editValue === "true";
      } else if (
        Array.isArray(value) ||
        (typeof value === "object" && value !== null)
      ) {
        parsedValue = JSON.parse(editValue);
      }
      onChange(parsedValue);
      setIsEditing(false);
    } catch (e) {
      console.error("도구 설정 값 저장 도중 에러 발생: " + e);
      toast.error("설정 JSON 형태가 올바르지 않습니다.");
    }
  };

  // String 타입
  if (typeof value === "string") {
    if (isEditing) {
      return (
        <div className="space-y-2">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="text-xs font-mono"
          />
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleSave}>
              저장
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsEditing(false);
                setEditValue(String(value));
              }}
            >
              취소
            </Button>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <span className={`text-xs font-mono ${colorClass} break-all`}>
          &quot;{value}&quot;
        </span>
        {onChange && (
          <Button
            size="sm"
            variant="ghost"
            className="h-6 px-2"
            onClick={() => {
              setIsEditing(true);
              setEditValue(value);
            }}
          >
            <Edit2 className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  // Number 타입
  if (typeof value === "number") {
    if (isEditing) {
      return (
        <div className="space-y-2">
          <Input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="text-xs font-mono"
          />
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleSave}>
              저장
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsEditing(false);
                setEditValue(String(value));
              }}
            >
              취소
            </Button>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <span className={`text-xs font-mono font-semibold ${colorClass}`}>
          {value}
        </span>
        {onChange && (
          <Button
            size="sm"
            variant="ghost"
            className="h-6 px-2"
            onClick={() => {
              setIsEditing(true);
              setEditValue(String(value));
            }}
          >
            <Edit2 className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  // Boolean 타입
  if (typeof value === "boolean") {
    if (isEditing) {
      return (
        <div className="space-y-2">
          <select
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="text-xs font-mono px-2 py-1 rounded border bg-background"
          >
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleSave}>
              저장
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsEditing(false);
                setEditValue(String(value));
              }}
            >
              취소
            </Button>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <Badge
          className={`${bgColorClass} ${colorClass} border text-xs font-mono`}
        >
          {value ? "true" : "false"}
        </Badge>
        {onChange && (
          <Button
            size="sm"
            variant="ghost"
            className="h-6 px-2"
            onClick={() => {
              setIsEditing(true);
              setEditValue(String(value));
            }}
          >
            <Edit2 className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  // Array 타입
  if (Array.isArray(value)) {
    if (isEditing) {
      return (
        <div className="space-y-2">
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="text-xs font-mono resize-none field-sizing-content"
          />
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleSave}>
              저장
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsEditing(false);
                setEditValue(JSON.stringify(value, null, 2));
              }}
            >
              취소
            </Button>
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-xs font-medium hover:underline"
          >
            <ChevronDown
              className={cn(
                "h-3 w-3 transition-transform duration-300",
                !isExpanded && "rotate-180"
              )}
            />
            <span className={colorClass}>Array {value.length}</span>
          </button>
          {onChange && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2"
              onClick={() => {
                setIsEditing(true);
                setEditValue(JSON.stringify(value, null, 2));
              }}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          )}
        </div>
        {isExpanded && !isEditing && (
          <div className="ml-4 space-y-1.5 border-l-2 border-orange-200 dark:border-orange-800 pl-3">
            {value.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-2 text-xs p-2 bg-orange-50/30 dark:bg-orange-950/10 rounded"
              >
                <span className="text-muted-foreground min-w-[20px]">
                  [{index}]
                </span>
                <ConfigValue value={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Object 타입
  if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value);

    if (isEditing) {
      const handleCodeChange = (value: string) => {
        if (!onChange) return;
        try {
          const parsed = JSON.parse(value);
          onChange(parsed);
        } catch (e) {
          console.error(e);
          // JSON 파싱 오류는 무시 (사용자가 입력 중일 수 있음)
        }
      };

      return (
        <div className="space-y-2">
          <div className="border rounded-lg overflow-hidden bg-background">
            <CodeMirror
              value={editValue}
              onChange={(value) => {
                setEditValue(value);
                handleCodeChange(value);
              }}
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
              minHeight="200px"
              maxHeight="400px"
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                try {
                  const parsed = JSON.parse(editValue);
                  if (onChange) {
                    onChange(parsed);
                  }
                  setIsEditing(false);
                } catch (e) {
                  toast.error(
                    e instanceof Error
                      ? e.message
                      : "유효하지 않은 JSON 형식입니다."
                  );
                }
              }}
            >
              저장
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsEditing(false);
                setEditValue(JSON.stringify(value, null, 2));
              }}
            >
              취소
            </Button>
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-xs font-medium hover:underline"
          >
            <ChevronDown
              className={cn(
                "h-3 w-3 transition-transform duration-300",
                !isExpanded && "rotate-180"
              )}
            />
            <span className={colorClass}>Object</span>
          </button>
          {onChange && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2"
              onClick={() => {
                setIsEditing(true);
                setEditValue(JSON.stringify(value, null, 2));
              }}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          )}
        </div>
        {isExpanded && !isEditing && (
          <div className="ml-4 space-y-2 border-l-2 border-pink-200 dark:border-pink-800 pl-3">
            {entries.map(([key, val]) => {
              if (isEmptyValue(val)) {
                return null;
              }
              return (
                <div
                  key={key}
                  className="p-2 bg-pink-50/30 dark:bg-pink-950/10 rounded space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <Key className="h-3 w-3 text-pink-600 dark:text-pink-400" />
                    <span className="text-xs font-mono font-semibold text-pink-700 dark:text-pink-300">
                      {key}:
                    </span>
                  </div>
                  <div className="ml-5">
                    <ConfigValue value={val} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <span className="text-xs font-mono text-muted-foreground">
      {String(value)}
    </span>
  );
};

export function ServerConfigCard({ config, toolId }: ServerConfigCardProps) {
  const [editedConfig, setEditedConfig] =
    useState<GetToolConfigResponse>(config);
  const serverConfigEntries = Object.entries(editedConfig);
  const queryClient = useQueryClient();

  // 편집 가능한 필드 목록 (PutToolConfigRequest에 포함된 필드만)
  const editableFields = [
    "server_config",
    "secrets",
    "health_check_enabled",
  ] as const;

  const { mutate: updateConfig, isPending } = usePutToolConfig({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["mcp-tool-config", toolId],
      });
    },
    meta: {
      successMessage: "설정이 성공적으로 저장되었습니다.",
    },
  });

  const handleSave = () => {
    updateConfig({
      params: { tool_id: toolId },
      data: {
        server_config:
          editedConfig.server_config as unknown as PutToolConfigRequest["server_config"],
        secrets: editedConfig.secrets,
        health_check_enabled: editedConfig.health_check_enabled,
      },
    });
  };

  const handleValueChange = (key: string, newValue: unknown) => {
    setEditedConfig((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  return (
    <>
      {/* Server Configuration Card */}
      <Card className="md:col-span-2">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              서버 설정 정보
            </CardTitle>
            <Button onClick={handleSave} disabled={isPending} size="sm">
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  저장 중...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  저장
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Server Config List */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Database className="h-4 w-4 text-primary" />
              <span>서버 설정 항목</span>
            </div>

            <div className="space-y-3">
              {serverConfigEntries.map(([key, value]) => {
                const ValueIcon = getValueIcon(value);
                const bgColorClass = getValueBgColor(value);
                const isEditable = editableFields.includes(
                  key as (typeof editableFields)[number]
                );
                if (isEmptyValue(value)) {
                  return null;
                }
                return (
                  <div
                    key={key}
                    className={`p-4 rounded-lg border ${bgColorClass} hover:shadow-md transition-shadow`}
                  >
                    <div className="space-y-3">
                      {/* Key */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-7 w-7 bg-background rounded-md border">
                          <ValueIcon className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-mono font-bold text-sm text-foreground">
                          {key}
                        </span>
                        {!isEditable && (
                          <Badge variant="outline" className="text-xs">
                            읽기 전용
                          </Badge>
                        )}
                      </div>

                      {/* Value */}
                      <div className="ml-9 pl-4 border-l-2 border-border">
                        <ConfigValue
                          value={value}
                          onChange={
                            isEditable
                              ? (newValue) => handleValueChange(key, newValue)
                              : undefined
                          }
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
