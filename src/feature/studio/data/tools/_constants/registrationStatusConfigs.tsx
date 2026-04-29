import React from "react";
import {
  CheckCircle,
  PauseCircle,
  Clock,
  XCircle,
  MinusCircle,
  HeartPulse,
  HelpCircle,
} from "lucide-react";

/**
 * Registration 상태 설정 (v0.9.11)
 * 기존 container_status에서 registration_status로 변경
 */
export const REGISTRATION_STATUS_CONFIG: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ReactNode;
    className?: string;
  }
> = {
  pending_verification: {
    label: "검증 대기",
    variant: "outline",
    icon: <Clock className="h-3 w-3" />,
    className: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  active: {
    label: "활성",
    variant: "default",
    icon: <CheckCircle className="h-3 w-3" />,
    className: "bg-green-50 text-green-700 border-green-200",
  },
  unhealthy: {
    label: "비정상",
    variant: "destructive",
    icon: <XCircle className="h-3 w-3" />,
    className: "bg-red-50 text-red-700 border-red-200",
  },
  disabled: {
    label: "비활성화",
    variant: "secondary",
    icon: <PauseCircle className="h-3 w-3" />,
    className: "bg-slate-50 text-slate-700 border-slate-200",
  },
  deregistered: {
    label: "등록 해제",
    variant: "outline",
    icon: <MinusCircle className="h-3 w-3" />,
    className: "bg-gray-50 text-gray-500 border-gray-200",
  },
};

/**
 * Health 상태 설정
 */
export const HEALTH_STATUS_CONFIG: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ReactNode;
    className?: string;
  }
> = {
  healthy: {
    label: "정상",
    variant: "default",
    icon: <HeartPulse className="h-3 w-3" />,
    className: "bg-green-50 text-green-700 border-green-200",
  },
  unhealthy: {
    label: "비정상",
    variant: "destructive",
    icon: <XCircle className="h-3 w-3" />,
    className: "bg-red-50 text-red-700 border-red-200",
  },
  unknown: {
    label: "알 수 없음",
    variant: "outline",
    icon: <HelpCircle className="h-3 w-3" />,
    className: "bg-slate-50 text-slate-700 border-slate-200",
  },
};

/**
 * Registration 상태 옵션 (Select 드롭다운용)
 */
export const REGISTRATION_STATUS_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "pending_verification", label: "검증 대기" },
  { value: "active", label: "활성" },
  { value: "unhealthy", label: "비정상" },
  { value: "disabled", label: "비활성화" },
  { value: "deregistered", label: "등록 해제" },
] as const;

/**
 * Health 상태 옵션 (Select 드롭다운용)
 */
export const HEALTH_STATUS_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "healthy", label: "정상" },
  { value: "unhealthy", label: "비정상" },
  { value: "unknown", label: "알 수 없음" },
] as const;
