"use client";

import { useState } from "react";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { FolderTree, Check } from "lucide-react";
import { Skeleton } from "@/shared/ui/skeleton";
import { Pagination } from "@/shared/ui/pagination";
import { useGetGroups } from "../hooks/useGetGroups";
import { cn } from "@/shared/lib/utils";

interface ParentGroupSelectProps {
  value?: number;
  onChange: (value: number | undefined) => void;
}

export default function ParentGroupSelect({
  value,
  onChange,
}: ParentGroupSelectProps) {
  // 페이지네이션 상태
  const [groupPage, setGroupPage] = useState(1);

  // 그룹 목록 조회
  const { data: groups, isLoading: isLoadingGroups } = useGetGroups({
    page: groupPage,
    size: 10,
    include_members: true,
  });

  return (
    <div className="space-y-2">
      <Label htmlFor="parent_group_id" className="flex items-center gap-2">
        <FolderTree className="h-4 w-4" />
        <span>상위 그룹</span>
      </Label>

      {isLoadingGroups && (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}
      {!isLoadingGroups && (
        <div className="space-y-2">
          {/* 상위 그룹 없음 옵션 */}
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-start h-auto py-3 px-4",
              !value && "border-primary bg-primary/5"
            )}
            onClick={() => onChange(undefined)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col items-start">
                <span className="font-medium">상위 그룹 없음</span>
                <span className="text-xs text-muted-foreground">
                  최상위 그룹으로 생성됩니다
                </span>
              </div>
              {!value && <Check className="h-5 w-5 text-primary" />}
            </div>
          </Button>

          {/* 그룹 리스트 */}
          {groups?.items.map((group) => {
            const isSelected = value === group.id;
            return (
              <Button
                key={group.id}
                type="button"
                variant="outline"
                className={cn(
                  "w-full justify-start h-auto py-3 px-4",
                  isSelected && "border-primary bg-primary/5"
                )}
                onClick={() => onChange(group.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{group.group_name}</span>
                    <span className="text-xs text-muted-foreground">
                      ID: {group.id}
                    </span>
                  </div>
                  {isSelected && <Check className="h-5 w-5 text-primary" />}
                </div>
              </Button>
            );
          })}
        </div>
      )}

      {/* 페이지네이션 */}
      {groups && groups.total_pages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination
            currentPage={groupPage}
            totalPages={groups.total_pages || 1}
            onPageChange={setGroupPage}
            isLoading={isLoadingGroups}
            maxVisiblePages={5}
            showFirstLast={false}
          />
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        이 그룹의 상위 그룹을 선택하세요
        {groups?.total && ` (전체 ${groups.total}개)`}
      </p>
    </div>
  );
}
