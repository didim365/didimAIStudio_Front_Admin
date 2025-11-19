"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import {
  Settings,
  CheckCircle2,
  XCircle,
  AlertCircle,
  GitBranch,
  Shield,
  Key,
  Calendar,
  ChevronDown,
  ChevronRight,
  Braces,
  List,
  Link2,
  FileCode,
  Hash,
  Type,
  ToggleLeft,
  Database,
} from "lucide-react";
import { formatDate } from "@/shared/utils/formatDate";
import { useState } from "react";
import { GetMcpToolConfigResponse } from "../api/getMcpToolConfig";

interface ServerConfigCardProps {
  config: GetMcpToolConfigResponse;
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
const ConfigValue = ({ value }: { value: unknown }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const colorClass = getValueColor(value);
  const bgColorClass = getValueBgColor(value);

  // null 처리
  if (value === null) {
    return (
      <span className="text-xs font-mono text-muted-foreground italic">
        null
      </span>
    );
  }

  // String 타입
  if (typeof value === "string") {
    // URL 감지
    const isUrl = value.startsWith("http://") || value.startsWith("https://");
    if (isUrl) {
      return (
        <div className="flex items-center gap-2">
          <Link2 className={`h-3 w-3 ${colorClass}`} />
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs font-mono ${colorClass} hover:underline break-all`}
          >
            {value}
          </a>
        </div>
      );
    }
    return (
      <span className={`text-xs font-mono ${colorClass} break-all`}>
        &quot;{value}&quot;
      </span>
    );
  }

  // Number 타입
  if (typeof value === "number") {
    return (
      <span className={`text-xs font-mono font-semibold ${colorClass}`}>
        {value}
      </span>
    );
  }

  // Boolean 타입
  if (typeof value === "boolean") {
    return (
      <Badge
        className={`${bgColorClass} ${colorClass} border text-xs font-mono`}
      >
        {value ? "true" : "false"}
      </Badge>
    );
  }

  // Array 타입
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return (
        <span className="text-xs font-mono text-muted-foreground">[]</span>
      );
    }

    return (
      <div className="space-y-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-xs font-medium hover:underline"
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
          <span className={colorClass}>
            Array ({value.length} {value.length === 1 ? "item" : "items"})
          </span>
        </button>
        {isExpanded && (
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
    if (entries.length === 0) {
      return (
        <span className="text-xs font-mono text-muted-foreground">{"{}"}</span>
      );
    }

    return (
      <div className="space-y-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-xs font-medium hover:underline"
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
          <span className={colorClass}>
            Object ({entries.length}{" "}
            {entries.length === 1 ? "property" : "properties"})
          </span>
        </button>
        {isExpanded && (
          <div className="ml-4 space-y-2 border-l-2 border-pink-200 dark:border-pink-800 pl-3">
            {entries.map(([key, val]) => (
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
            ))}
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

export function ServerConfigCard({ config }: ServerConfigCardProps) {
  console.log({ config });
  const serverConfigEntries = Object.entries(config?.server_config || {});

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
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Server Config List */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Database className="h-4 w-4 text-primary" />
              <span>서버 설정 항목</span>
              <Badge variant="outline" className="ml-auto">
                {serverConfigEntries.length} 항목
              </Badge>
            </div>

            <div className="space-y-3">
              {serverConfigEntries.map(([key, value]) => {
                const ValueIcon = getValueIcon(value);
                const bgColorClass = getValueBgColor(value);

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
                        <Badge variant="outline" className="ml-auto text-xs">
                          {typeof value === "object" && value !== null
                            ? Array.isArray(value)
                              ? "array"
                              : "object"
                            : typeof value}
                        </Badge>
                      </div>

                      {/* Value */}
                      <div className="ml-9 pl-4 border-l-2 border-border">
                        <ConfigValue value={value} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Config Metadata Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Has Secrets */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3.5 w-3.5" />
                <span className="font-medium">민감 정보 포함</span>
              </div>
              <div className="pl-5">
                {config.has_secrets ? (
                  <Badge className="bg-orange-50 text-orange-700 border-orange-200 border">
                    <Key className="h-3 w-3 mr-1" />
                    있음
                  </Badge>
                ) : (
                  <Badge className="bg-gray-50 text-gray-700 border-gray-200 border">
                    없음
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
