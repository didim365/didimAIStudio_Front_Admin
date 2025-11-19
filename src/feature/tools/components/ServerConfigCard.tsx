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
import { useState, useEffect } from "react";
import { GetMcpToolConfigResponse } from "../api/getMcpToolConfig";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { usePutMcpToolConfig } from "../hooks/usePutMcpToolConfig";
import { useQueryClient } from "@tanstack/react-query";
import { Save, Loader2, Edit2 } from "lucide-react";

interface ServerConfigCardProps {
  config: GetMcpToolConfigResponse;
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
      // JSON 파싱 실패 시 무시
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
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") {
                setIsEditing(false);
                setEditValue(String(value));
              }
            }}
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
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") {
                setIsEditing(false);
                setEditValue(String(value));
              }
            }}
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
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") {
                setIsEditing(false);
                setEditValue(String(value));
              }
            }}
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
            className="text-xs font-mono min-h-[100px]"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsEditing(false);
                setEditValue(JSON.stringify(value, null, 2));
              }
            }}
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
      return (
        <div className="space-y-2">
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="text-xs font-mono min-h-[100px]"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsEditing(false);
                setEditValue(JSON.stringify(value, null, 2));
              }
            }}
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
              if (val === null) {
                return null;
              }
              if (Array.isArray(val) && val.length === 0) {
                return null;
              }
              if (
                typeof val === "object" &&
                val !== null &&
                Object.keys(val).length === 0
              ) {
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
    useState<GetMcpToolConfigResponse>(config);
  const serverConfigEntries = Object.entries(editedConfig);
  const queryClient = useQueryClient();

  useEffect(() => {
    setEditedConfig(config);
  }, [config]);

  const { mutate: updateConfig, isPending } = usePutMcpToolConfig({
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
      data: editedConfig,
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
                if (
                  value === null ||
                  (Array.isArray(value) && value.length === 0) ||
                  (typeof value === "object" &&
                    value !== null &&
                    Object.keys(value).length === 0)
                ) {
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
                      </div>

                      {/* Value */}
                      <div className="ml-9 pl-4 border-l-2 border-border">
                        <ConfigValue
                          value={value}
                          onChange={(newValue) =>
                            handleValueChange(key, newValue)
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
