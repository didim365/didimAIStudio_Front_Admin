"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type QueryParamValue = string | number;

interface UseQueryParamOptions {
  /**
   * URL 업데이트를 지연시킬 밀리초 (debounce)
   * 검색어 입력과 같이 연속적인 입력이 발생하는 경우 유용
   */
  debounce?: number;
}

/**
 * URL 쿼리 파라미터를 useState처럼 관리하는 커스텀 훅
 *
 * @param key - 쿼리 파라미터 키
 * @param initialValue - 초기값 (URL에 값이 없을 때 사용)
 * @param options - debounce 옵션 등
 * @returns [현재 값, 값을 업데이트하는 함수]
 *
 * @example
 * // 검색어 - debounce 적용
 * const [search, setSearch] = useQueryParam('search', '', { debounce: 300 });
 *
 * // 카테고리 - 즉시 업데이트
 * const [category, setCategory] = useQueryParam('category', 'all');
 *
 * // 페이지 번호
 * const [page, setPage] = useQueryParam('page', 1);
 */
export function useQueryParam<T extends QueryParamValue>(
  key: string,
  initialValue: T,
  options: UseQueryParamOptions = {}
): [T, (value: T) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { debounce = 0 } = options;

  // URL에서 현재 값 읽기
  const urlValue = searchParams.get(key);
  const valueFromUrl =
    urlValue === null
      ? initialValue
      : typeof initialValue === "number"
      ? (Number(urlValue) as T)
      : (urlValue as T);

  // 로컬 상태 (debounce 중 입력 값 저장)
  const [localValue, setLocalValue] = useState<T>(valueFromUrl);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // URL 값이 변경되면 로컬 값도 동기화 (외부에서 URL이 변경된 경우 대응)
  useEffect(() => {
    setLocalValue(valueFromUrl);
  }, [valueFromUrl]);

  // URL 업데이트 함수
  const updateUrl = (value: T) => {
    const params = new URLSearchParams(searchParams.toString());

    // 초기값이거나 빈 값이거나 "all"인 경우 파라미터 제거
    if (
      value === initialValue ||
      value === "" ||
      value === "all" ||
      value === null
    ) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // 값 업데이트 함수
  const setValue = (value: T) => {
    // 로컬 값 즉시 업데이트 (깜빡임 방지)
    setLocalValue(value);

    // 기존 타이머 취소
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // debounce가 설정된 경우
    if (debounce > 0) {
      // 지연 후 URL 업데이트
      debounceTimerRef.current = setTimeout(() => {
        updateUrl(value);
      }, debounce);
    } else {
      // debounce가 없으면 즉시 URL 업데이트
      updateUrl(value);
    }
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return [localValue, setValue];
}
