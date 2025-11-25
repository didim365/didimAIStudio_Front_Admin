import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";
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
}

export function ErrorDisplay({
  error,
  title,
  description,
  className,
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
    <div className={cn("flex justify-center p-4 w-full", className)}>
      <Card className="w-full border-destructive/20 shadow-lg">
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
            <p className="text-sm text-muted-foreground wrap-break-words">
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

        <div className="flex justify-center pb-6 pt-4">
          <Button asChild size="lg">
            <Link href="/dashboard">
              <Home className="h-4 w-4 mr-2" />
              대시보드로 이동
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
