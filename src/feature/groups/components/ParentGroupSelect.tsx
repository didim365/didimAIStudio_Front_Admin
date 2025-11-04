"use client";

import { useState } from "react";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Search, FolderTree } from "lucide-react";
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
  // 페이지네이션 및 검색 상태
  const [groupPage, setGroupPage] = useState(1);
  const [groupSearchQuery, setGroupSearchQuery] = useState("");

  // 그룹 목록 조회
  const { data: groups, isLoading: isLoadingGroups } = useGetGroups({
    page: groupPage,
    size: 10,
    include_members: true,
  });

  // 클라이언트 사이드 검색 필터링
  const filteredGroups = groups?.items?.filter((group) =>
    groupSearchQuery
      ? group.group_name.toLowerCase().includes(groupSearchQuery.toLowerCase())
      : true
  );

  // 검색어가 변경되면 첫 페이지로 리셋
  const handleGroupSearchChange = (value: string) => {
    setGroupSearchQuery(value);
    setGroupPage(1);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="parent_group_id" className="flex items-center gap-2">
        <FolderTree className="h-4 w-4" />
        <span>상위 그룹</span>
      </Label>
      {/* 검색 입력 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="그룹명으로 검색..."
          value={groupSearchQuery}
          onChange={(e) => handleGroupSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
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
          {filteredGroups?.map((group) => (
            <SelectItem key={group.id} value={group.id.toString()}>
              <div className="flex flex-col items-start">
                <span className="font-medium">{group.group_name}</span>
                <span className="text-xs text-muted-foreground">
                  ID: {group.id}
                </span>
              </div>
            </SelectItem>
          ))}
          {filteredGroups?.length === 0 &&
            groups?.items &&
            groups.items.length > 0 && (
              <SelectItem value="no-results" disabled>
                검색 결과가 없습니다
              </SelectItem>
            )}
          {!groups?.items || groups.items.length === 0 ? (
            <SelectItem value="no-results" disabled>
              그룹이 없습니다
            </SelectItem>
          ) : null}
        </SelectContent>
      </Select>
      {/* 페이지네이션 */}
      {groups && groups.total_pages > 1 && !groupSearchQuery && (
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
      {groupSearchQuery && (
        <p className="text-xs text-muted-foreground text-center pt-2">
          검색 중에는 현재 페이지의 결과만 표시됩니다. 전체 검색을 위해 검색어를
          비워주세요.
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        이 그룹의 상위 그룹을 선택하세요
        {groups?.total && ` (전체 ${groups.total}개)`}
      </p>
    </div>
  );
}
