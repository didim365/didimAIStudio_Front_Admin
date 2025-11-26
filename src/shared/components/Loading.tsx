"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface LoadingProps {
  /**
   * 로딩 텍스트
   * @default "로딩 중..."
   */
  text?: string;
  /**
   * 로딩 스피너 크기
   * @default "md"
   */
  size?: "sm" | "md" | "lg" | "xl";
  /**
   * 전체 화면 로딩 여부
   * @default false
   */
  fullScreen?: boolean;
  /**
   * 추가 클래스명
   */
  className?: string;
  /**
   * 스피너만 표시 (텍스트 없음)
   * @default false
   */
  spinnerOnly?: boolean;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

export function Loading({
  text = "로딩 중...",
  size = "md",
  fullScreen = false,
  className,
  spinnerOnly = false,
}: LoadingProps) {
  const spinnerSize = sizeMap[size];

  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        !fullScreen && "p-4",
        className
      )}
    >
      <Loader2
        className={cn(
          "animate-spin text-primary",
          spinnerSize
        )}
      />
      {!spinnerOnly && (
        <p className="text-sm font-medium text-muted-foreground">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center",
          "bg-black/50 backdrop-blur-sm",
          "animate-in fade-in-0 duration-200"
        )}
      >
        {content}
      </div>
    );
  }

  return content;
}

