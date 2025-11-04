"use client";

import { useState } from "react";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { FolderTree } from "lucide-react";
import { Skeleton } from "@/shared/ui/skeleton";
import { Pagination } from "@/shared/ui/pagination";
import { useGetGroups } from "../hooks/useGetGroups";

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
      {isLoadingGroups && <Skeleton className="h-10 w-full" />}
      <Select
        value={value?.toString() || "none"}
        onValueChange={(selectedValue) =>
          onChange(selectedValue === "none" ? undefined : Number(selectedValue))
        }
      >
        <SelectTrigger id="parent_group_id" className="pl-6 w-full">
          <SelectValue placeholder="상위 그룹 선택 (선택사항)" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          <SelectItem value="none">상위 그룹 없음</SelectItem>
          {groups?.items?.map((group) => (
            <SelectItem key={group.id} value={group.id.toString()}>
              <div className="flex flex-col items-start">
                <span className="font-medium">{group.group_name}</span>
                <span className="text-xs text-muted-foreground">
                  ID: {group.id}
                </span>
              </div>
            </SelectItem>
          ))}
          {!groups?.items ||
            (groups.items.length === 0 && (
              <SelectItem value="no-results" disabled>
                그룹이 없습니다
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
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
