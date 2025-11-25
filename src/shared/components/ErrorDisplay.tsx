"use client";

import Link from "next/link";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
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
        "flex min-h-[60vh] items-center justify-center p-4 sm:p-6 lg:p-8 w-full",
        className
      )}
    >
      <div className="w-full max-w-2xl">
        <Card className="relative overflow-hidden border-0 shadow-2xl bg-linear-to-br from-background via-background to-destructive/5">
          {/* 배경 그라데이션 효과 */}
          <div className="absolute inset-0 bg-linear-to-br from-destructive/5 via-transparent to-destructive/10 opacity-50" />
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-destructive via-destructive/50 to-transparent" />

          <CardHeader className="relative text-center space-y-6 pb-8 pt-12">
            {/* 애니메이션 아이콘 */}
            <div className="relative mx-auto">
              <div className="absolute inset-0 rounded-full bg-destructive/20 animate-pulse" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-destructive/20 via-destructive/10 to-destructive/5 backdrop-blur-sm border-2 border-destructive/30 shadow-lg">
                <AlertCircle className="h-12 w-12 text-destructive drop-shadow-lg" />
              </div>
            </div>

            <div className="space-y-3">
              <CardTitle className="text-3xl sm:text-4xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                {displayTitle}
              </CardTitle>
              <CardDescription className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                {displayDescription}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="relative space-y-6 px-6 sm:px-8 pb-8">
            {/* 에러 메시지 상세 */}
            <div className="group relative rounded-xl border border-destructive/30 bg-linear-to-br from-destructive/10 via-destructive/5 to-transparent p-5 backdrop-blur-sm shadow-inner transition-all hover:border-destructive/40 hover:shadow-md">
              <div className="absolute inset-0 rounded-xl bg-linear-to-br from-destructive/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
                  <p className="text-sm font-semibold text-destructive tracking-wide uppercase">
                    오류 상세 정보
                  </p>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground wrap-break-word leading-relaxed font-mono bg-background/50 rounded-md p-3 border border-destructive/10">
                  {errorMessage}
                </p>
              </div>
            </div>

            {/* 추가 정보 (digest가 있는 경우) */}
            {typeof error === "object" &&
              !(error instanceof Error) &&
              error?.digest && (
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-4 py-2 border border-border/50">
                  <span className="font-medium">오류 코드:</span>
                  <code className="font-mono text-destructive font-semibold">
                    {error.digest}
                  </code>
                </div>
              )}
          </CardContent>

          {/* 액션 버튼 */}
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 pb-8 px-6 sm:px-8">
            {onRetry && (
              <Button
                onClick={onRetry}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-w-[160px] group"
              >
                <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                다시 시도
              </Button>
            )}
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto min-w-[160px] bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Link href="/dashboard" className="group">
                <Home className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                대시보드로 이동
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
