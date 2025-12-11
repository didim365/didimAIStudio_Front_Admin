"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Check, Search, X } from "lucide-react";
import { Skeleton } from "@/shared/ui/skeleton";
import { Pagination } from "@/shared/ui/pagination";
import { Checkbox } from "@/shared/ui/checkbox";
import { useGetGroups } from "../_hooks/useGetGroups";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Label } from "@/shared/ui/label";

interface ChildGroupsSelectProps {
  value?: number[];
  onChange: (value: number[]) => void;
  excludeGroupId?: number; // 현재 생성 중인 그룹을 제외하기 위한 옵션
}

export default function ChildGroupsSelect({
  value = [],
  onChange,
  excludeGroupId,
}: ChildGroupsSelectProps) {
  // 검색 및 페이지네이션 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [groupPage, setGroupPage] = useState(1);

  // 그룹 목록 조회
  const { data: groups, isLoading: isLoadingGroups } = useGetGroups({
    page: groupPage,
    size: 10,
    include_members: true,
    search: searchQuery || undefined,
  });

  // 검색어 변경 시 첫 페이지로 리셋
  const handleSearchChange = (searchValue: string) => {
    setSearchQuery(searchValue);
    setGroupPage(1);
  };

  // 그룹 선택/해제 핸들러
  const handleToggleGroup = (groupId: number) => {
    const isSelected = value.includes(groupId);
    if (isSelected) {
      onChange(value.filter((id) => id !== groupId));
    } else {
      onChange([...value, groupId]);
    }
  };

  // 선택된 그룹 제거 핸들러
  const handleRemoveGroup = (groupId: number) => {
    onChange(value.filter((id) => id !== groupId));
  };

  // 필터링된 그룹 목록 (제외할 그룹 제외)
  const filteredGroups = groups?.items.filter(
    (group) => group.id !== excludeGroupId
  ) || [];

  return (
    <div className="space-y-4">
      {/* 검색 입력 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="그룹명으로 검색..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* 선택된 그룹 표시 */}
      {value.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">
            선택된 하위 그룹 ({value.length}개)
          </Label>
          <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-md border border-dashed min-h-[3rem]">
            {groups?.items
              .filter((group) => value.includes(group.id))
              .map((group) => (
                <Badge
                  key={group.id}
                  variant="secondary"
                  className="px-3 py-1.5 text-sm flex items-center gap-2"
                >
                  <span>{group.group_name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveGroup(group.id)}
                    className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5 transition-colors"
                    aria-label={`${group.group_name} 제거`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            {groups?.items.filter((group) => value.includes(group.id))
              .length === 0 && (
              <p className="text-xs text-muted-foreground w-full text-center py-2">
                선택된 그룹을 검색하여 확인하세요
              </p>
            )}
          </div>
        </div>
      )}

      {/* 그룹 목록 */}
      {isLoadingGroups && (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {!isLoadingGroups && (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {filteredGroups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">
                {searchQuery ? "검색 결과가 없습니다" : "그룹이 없습니다"}
              </p>
            </div>
          ) : (
            filteredGroups.map((group) => {
              const isSelected = value.includes(group.id);
              return (
                <Button
                  key={group.id}
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start h-auto py-3 px-4 hover:bg-accent",
                    isSelected && "border-primary bg-primary/5"
                  )}
                  onClick={() => handleToggleGroup(group.id)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggleGroup(group.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0"
                    />
                    <div className="flex flex-col items-start flex-1 min-w-0">
                      <span className="font-medium truncate w-full">
                        {group.group_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ID: {group.id} • 타입: {group.group_type}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="h-5 w-5 text-primary shrink-0" />
                    )}
                  </div>
                </Button>
              );
            })
          )}
        </div>
      )}

      {/* 페이지네이션 */}
      {groups && groups.total_pages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination
            currentPage={groupPage}
            totalPages={groups.total_pages ?? 1}
            onPageChange={setGroupPage}
            isLoading={isLoadingGroups}
          />
        </div>
      )}

    </div>
  );
}

