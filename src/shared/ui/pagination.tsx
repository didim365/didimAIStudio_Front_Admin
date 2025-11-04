"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export interface PaginationProps {
  /**
   * 현재 페이지 번호
   */
  currentPage: number;
  /**
   * 전체 페이지 수
   */
  totalPages: number;
  /**
   * 페이지 변경 핸들러
   */
  onPageChange: (page: number) => void;
  /**
   * 이전 페이지 존재 여부 (선택사항, 없으면 currentPage로 판단)
   */
  hasPrevious?: boolean;
  /**
   * 다음 페이지 존재 여부 (선택사항, 없으면 currentPage로 판단)
   */
  hasNext?: boolean;
  /**
   * 로딩 상태
   */
  isLoading?: boolean;
  /**
   * 페이지 번호 버튼 최대 표시 개수 (기본값: 5)
   */
  maxVisiblePages?: number;
  /**
   * 첫/마지막 페이지 버튼 표시 여부 (기본값: true)
   */
  showFirstLast?: boolean;
  /**
   * 추가 클래스명
   */
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasPrevious,
  hasNext,
  isLoading = false,
  maxVisiblePages = 5,
  showFirstLast = true,
  className,
}: PaginationProps) {
  // 전체 페이지가 1 이하이면 표시하지 않음
  if (totalPages <= 1) {
    return null;
  }

  // hasPrevious/hasNext가 제공되지 않으면 currentPage로 판단
  const canGoPrevious =
    hasPrevious !== undefined ? hasPrevious : currentPage > 1;
  const canGoNext = hasNext !== undefined ? hasNext : currentPage < totalPages;

  // 표시할 페이지 번호 배열 생성
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      // 전체 페이지가 표시할 개수보다 적으면 모두 표시
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const half = Math.floor(maxVisiblePages / 2);

    if (currentPage <= half + 1) {
      // 앞부분: 1, 2, 3, ..., totalPages
      for (let i = 1; i <= maxVisiblePages - 1; i++) {
        pages.push(i);
      }
      if (maxVisiblePages < totalPages) {
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    } else if (currentPage >= totalPages - half) {
      // 뒷부분: 1, ..., totalPages-2, totalPages-1, totalPages
      pages.push(1);
      if (totalPages - maxVisiblePages > 1) {
        pages.push("ellipsis");
      }
      for (let i = totalPages - maxVisiblePages + 2; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 중간: 1, ..., currentPage-1, currentPage, currentPage+1, ..., totalPages
      pages.push(1);
      pages.push("ellipsis");
      for (let i = currentPage - half + 2; i <= currentPage + half - 2; i++) {
        pages.push(i);
      }
      pages.push("ellipsis");
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage || isLoading) {
      return;
    }
    onPageChange(page);
  };

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      {/* 첫 페이지 버튼 */}
      {showFirstLast && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(1)}
          disabled={!canGoPrevious || isLoading}
          aria-label="첫 페이지"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      )}

      {/* 이전 페이지 버튼 */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!canGoPrevious || isLoading}
        aria-label="이전 페이지"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* 페이지 번호 버튼들 */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 py-1 text-sm text-slate-500"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Button
              key={pageNum}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(pageNum)}
              disabled={isLoading}
              aria-label={`${pageNum}페이지`}
              aria-current={isActive ? "page" : undefined}
              className={cn("min-w-10", isActive && "pointer-events-none")}
            >
              {pageNum}
            </Button>
          );
        })}
      </div>

      {/* 다음 페이지 버튼 */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!canGoNext || isLoading}
        aria-label="다음 페이지"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* 마지막 페이지 버튼 */}
      {showFirstLast && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(totalPages)}
          disabled={!canGoNext || isLoading}
          aria-label="마지막 페이지"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
