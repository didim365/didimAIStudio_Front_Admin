import React from "react";
import {
  PlayCircle,
  PauseCircle,
  Clock,
  XCircle,
  AlertCircle,
  Activity,
} from "lucide-react";

export const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ReactNode;
    className?: string;
  }
> = {
  running: {
    label: "실행 중",
    variant: "default",
    icon: <PlayCircle className="h-3 w-3" />,
    className: "bg-green-50 text-green-700 border-green-200",
  },
  stopped: {
    label: "중지됨",
    variant: "secondary",
    icon: <PauseCircle className="h-3 w-3" />,
    className: "bg-slate-50 text-slate-700 border-slate-200",
  },
  pending: {
    label: "대기 중",
    variant: "outline",
    icon: <Clock className="h-3 w-3" />,
    className: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  error: {
    label: "오류",
    variant: "destructive",
    icon: <XCircle className="h-3 w-3" />,
    className: "bg-red-50 text-red-700 border-red-200",
  },
  conflict: {
    label: "충돌",
    variant: "destructive",
    icon: <AlertCircle className="h-3 w-3" />,
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
  terminating: {
    label: "종료 중",
    variant: "outline",
    icon: <Activity className="h-3 w-3" />,
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
};

export const HEALTH_STATUS_CONFIG: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    className?: string;
  }
> = {
  healthy: {
    label: "정상",
    variant: "default",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  unhealthy: {
    label: "비정상",
    variant: "destructive",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  unknown: {
    label: "알 수 없음",
    variant: "outline",
    className: "bg-slate-50 text-slate-700 border-slate-200",
  },
};

// 컨테이너 상태 옵션 (Select 드롭다운용)
export const STATUS_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "running", label: "실행 중" },
  { value: "stopped", label: "중지됨" },
  { value: "pending", label: "대기 중" },
  { value: "error", label: "오류" },
  { value: "conflict", label: "충돌" },
  { value: "terminating", label: "종료 중" },
] as const;
