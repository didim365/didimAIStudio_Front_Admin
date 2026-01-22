"use client";

import { useState } from "react";
import { Input } from "@/shared/ui/input";
import { Check, Search, Folder, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetGroups } from "../_hooks/useGetGroups";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

interface GroupSelectProps {
  value?: number | number[];
  onChange: (value: number | number[] | undefined) => void;
  multiSelect?: boolean;
  excludeId?: number;
  className?: string;
}

export default function GroupSelect({
  value,
  onChange,
  multiSelect = false,
  excludeId,
  className,
}: GroupSelectProps) {
  // 검색 및 페이지네이션 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // 그룹 목록 조회
  const { data: groups, isLoading } = useGetGroups({
    page,
    page_size: 10,
    q: searchQuery || undefined,
    group_type: "TEAM"
  });

  const selectedIds = multiSelect
    ? (value as number[] | undefined) || []
    : value !== undefined
    ? [value as number]
    : [];

  const handleSelect = (id: number) => {
    if (multiSelect) {
      if (selectedIds.includes(id)) {
        onChange(selectedIds.filter((i) => i !== id));
      } else {
        onChange([...selectedIds, id]);
      }
    } else {
      if (selectedIds.includes(id)) {
        onChange(undefined);
      } else {
        onChange(id);
      }
    }
  };

  // 검색어 변경 시 첫 페이지로 리셋
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  // excludeId 필터링
  const filteredItems = groups?.items?.filter(
    (group) => !excludeId || group.id !== excludeId
  );

  return (
    <div className={cn("flex flex-col gap-2 h-full", className)}>
      {/* 그룹 목록 */}
      <div className="border rounded-md overflow-hidden flex-1 flex flex-col">
        {/* 검색 */}
        <div className="relative px-2 py-2 border-b shrink-0 flex items-center">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="그룹 이름 검색..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredItems?.map((group) => {
            const isSelected = selectedIds.includes(group.id);
            return (
              <div
                key={group.id}
                className={cn(
                  "flex items-center py-1.5 px-2 rounded-md cursor-pointer hover:bg-accent/50 transition-colors mx-1",
                  isSelected && "bg-accent"
                )}
                onClick={() => handleSelect(group.id)}
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted shrink-0 mr-2">
                  <Folder className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <span
                  className={cn(
                    "flex-1 text-sm truncate select-none",
                    isSelected && "font-medium"
                  )}
                >
                  {group.group_name}
                </span>
                {isSelected && (
                  <Check className="h-4 w-4 text-primary ml-2 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 페이지네이션 및 안내 */}
      <div className="flex items-center justify-between shrink-0">
        <p className="text-xs text-muted-foreground">
          * 폴더를 클릭하여 그룹을 선택하세요.
          {multiSelect && " (다중 선택 가능)"}
        </p>
        {groups && groups.total_pages > 1 && (
          <div className="flex items-center gap-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs text-muted-foreground px-1">
              {page}/{groups.total_pages}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() =>
                setPage((p) => Math.min(groups.total_pages ?? 1, p + 1))
              }
              disabled={page === groups.total_pages || isLoading}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
