"use client";

import { useRouter } from "next/navigation";
import { ErrorDisplay } from "@/shared/components/ErrorDisplay";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleHome = () => {
    router.push("/groups");
  };

  return (
    <ErrorDisplay
      error={error}
      reset={reset}
      onBack={handleBack}
      onHome={handleHome}
      title="그룹 정보를 불러올 수 없습니다"
      description="그룹 정보를 가져오는 중 문제가 발생했습니다. 네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요."
    />
  );
}
