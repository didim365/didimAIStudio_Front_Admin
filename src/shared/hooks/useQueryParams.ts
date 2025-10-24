"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

/**
 * URL 쿼리 파라미터를 관리하는 커스텀 훅
 * @returns {Object} searchParams, updateQueryParams 함수
 */
export function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /**
   * URL 쿼리 파라미터를 업데이트하는 함수
   * @param updates - 업데이트할 파라미터 객체 { key: value }
   *                  value가 null, "", "all"인 경우 해당 파라미터를 제거
   */
  const updateQueryParams = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return {
    searchParams,
    updateQueryParams,
  };
}
