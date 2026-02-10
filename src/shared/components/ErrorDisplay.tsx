"use client";

import Link from "next/link";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface ErrorDisplayProps {
  error: Error | { message?: string; digest?: string } | string;
  title?: string;
  description?: string;
  className?: string;
  onRetry?: () => void;
}

export function ErrorDisplay({
  error,
  title,
  description,
  className,
  onRetry,
}: ErrorDisplayProps) {
  // 에러 메시지 추출
  const getErrorMessage = () => {
    if (typeof error === "string") {
      return error;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return error?.message || "알 수 없는 오류가 발생했습니다.";
  };

  const errorMessage = getErrorMessage();
  const displayTitle = title || "오류가 발생했습니다";
  const displayDescription =
    description || "요청을 처리하는 중 문제가 발생했습니다.";

  return (
    <div
      className={cn(
        "flex h-full items-center justify-center p-4 sm:p-6 w-full",
        className
      )}
    >
      <div className="text-center space-y-6 max-w-lg w-full">
        {/* 아이콘 */}
        <div className="flex justify-center">
          <AlertCircle className="h-16 w-16 text-destructive" />
        </div>

        {/* 제목 및 설명 */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold">{displayTitle}</h1>
          <p className="text-muted-foreground">{displayDescription}</p>
        </div>

        {/* 에러 메시지 상세 */}
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <p className="text-sm font-semibold text-destructive mb-2">
            오류 상세 정보
          </p>
          <p className="text-sm text-muted-foreground wrap-break-words font-mono">
            {errorMessage}
          </p>
        </div>

        {/* 추가 정보 (digest가 있는 경우) */}
        {typeof error === "object" &&
          !(error instanceof Error) &&
          error?.digest && (
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>오류 코드:</span>
              <code className="font-mono text-destructive font-semibold">
                {error.digest}
              </code>
            </div>
          )}

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {onRetry && (
            <Button onClick={onRetry} variant="outline" size="lg">
              <RefreshCw className="h-4 w-4 mr-2" />
              다시 시도
            </Button>
          )}
          <Button asChild size="lg">
            <Link href="/users">
              <Home className="h-4 w-4 mr-2" />
              홈으로 이동
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
