"use client";

import { useState } from "react";
import { AlertCircle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";

interface ErrorDisplayProps {
  /**
   * 에러 객체 또는 에러 메시지
   */
  error: Error | { message?: string; digest?: string } | string;
  
  /**
   * 재시도 함수
   */
  reset?: () => void;
  
  /**
   * 뒤로가기 함수 (선택사항)
   */
  onBack?: () => void;
  
  /**
   * 홈으로 가기 함수 (선택사항)
   */
  onHome?: () => void;
  
  /**
   * 커스텀 제목
   */
  title?: string;
  
  /**
   * 커스텀 설명
   */
  description?: string;
  
  /**
   * 재시도 버튼 텍스트
   */
  retryLabel?: string;
  
  /**
   * 추가 클래스명
   */
  className?: string;
}

export function ErrorDisplay({
  error,
  reset,
  onBack,
  onHome,
  title,
  description,
  retryLabel = "다시 시도",
  className,
}: ErrorDisplayProps) {
  const [isRetrying, setIsRetrying] = useState(false);

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
    description ||
    "요청을 처리하는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";

  const handleRetry = async () => {
    if (!reset) return;
    
    setIsRetrying(true);
    try {
      // 재시도 전 약간의 딜레이를 주어 사용자에게 피드백 제공
      await new Promise((resolve) => setTimeout(resolve, 300));
      reset();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-[calc(100vh-8rem)] items-center justify-center p-4",
        className
      )}
    >
      <Card className="w-full max-w-lg border-destructive/20 shadow-lg">
        <CardHeader className="text-center space-y-4 pb-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold">{displayTitle}</CardTitle>
            <CardDescription className="text-base">
              {displayDescription}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 에러 메시지 상세 */}
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm font-medium text-destructive mb-2">
              오류 상세 정보
            </p>
            <p className="text-sm text-muted-foreground break-words">
              {errorMessage}
            </p>
          </div>

          {/* 추가 정보 (digest가 있는 경우) */}
          {typeof error === "object" &&
            !(error instanceof Error) &&
            error?.digest && (
              <div className="text-xs text-muted-foreground">
                오류 코드: {error.digest}
              </div>
            )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-4">
          {reset && (
            <Button
              onClick={handleRetry}
              disabled={isRetrying}
              className="w-full sm:w-auto sm:flex-1"
              size="lg"
            >
              <RefreshCw
                className={cn(
                  "h-4 w-4 mr-2",
                  isRetrying && "animate-spin"
                )}
              />
              {isRetrying ? "재시도 중..." : retryLabel}
            </Button>
          )}

          {onBack && (
            <Button
              onClick={onBack}
              variant="outline"
              className="w-full sm:w-auto"
              size="lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              뒤로 가기
            </Button>
          )}

          {onHome && (
            <Button
              onClick={onHome}
              variant="ghost"
              className="w-full sm:w-auto"
              size="lg"
            >
              <Home className="h-4 w-4 mr-2" />
              홈으로
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

