"use client";

import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex items-center justify-center from-background via-background to-muted/20 p-4">
      <Card className="max-w-2xl w-full border-2 shadow-2xl">
        <CardContent className="p-12">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* 404 아이콘 및 번호 */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full animate-pulse" />
              <div className="relative flex items-center justify-center">
                <h1 className="text-9xl font-black text-primary/90 tracking-tighter">
                  404
                </h1>
              </div>
            </div>

            {/* 메시지 */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                페이지를 찾을 수 없습니다
              </h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
                <br />
                URL을 확인하시거나 홈으로 돌아가주세요.
              </p>
            </div>

            {/* 액션 버튼 */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                size="lg"
                className="gap-2 min-w-[160px] text-base"
              >
                <ArrowLeft className="h-5 w-5" />
                이전 페이지
              </Button>
            </div>

            {/* 추가 도움말 */}
            <div className="pt-8 border-t border-border w-full">
              <p className="text-sm text-muted-foreground">
                문제가 지속되면 관리자에게 문의해주세요.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
