"use client";

import { useState } from "react";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { UserCog, Check, Search } from "lucide-react";
import { Skeleton } from "@/shared/ui/skeleton";
import { Pagination } from "@/shared/ui/pagination";
import { useGetUsers } from "@/feature/users/hooks/useGetUsers";
import { cn } from "@/shared/lib/utils";

interface ManagerSelectProps {
  value?: number;
  onChange: (value: number | undefined) => void;
}

export default function ManagerSelect({ value, onChange }: ManagerSelectProps) {
  // 검색 및 페이지네이션 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [userPage, setUserPage] = useState(1);

  // 사용자 목록 조회
  const { data: users, isLoading: isLoadingUsers } = useGetUsers({
    page: userPage,
    size: 10,
    search: searchQuery ?? undefined,
  });

  // 검색어 변경 시 첫 페이지로 리셋
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setUserPage(1);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="manager" className="flex items-center gap-2">
        <UserCog className="h-4 w-4" />
        <span>관리자</span>
      </Label>

      {/* 검색 입력 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="이름 또는 이메일로 검색..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoadingUsers && (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {!isLoadingUsers && (
        <div className="space-y-2">
          {/* 관리자 없음 옵션 */}
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
                <span className="font-medium">관리자 없음</span>
                <span className="text-xs text-muted-foreground">
                  관리자를 지정하지 않습니다
                </span>
              </div>
              {!value && <Check className="h-5 w-5 text-primary" />}
            </div>
          </Button>

          {/* 사용자 리스트 */}
          {users?.items.map((user) => {
            const isSelected = value === user.id;
            return (
              <Button
                key={user.id}
                type="button"
                variant="outline"
                className={cn(
                  "w-full justify-start h-auto py-3 px-4",
                  isSelected && "border-primary bg-primary/5"
                )}
                onClick={() => onChange(user.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">
                      {user.full_name ?? user.email}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                  {isSelected && <Check className="h-5 w-5 text-primary" />}
                </div>
              </Button>
            );
          })}
          {!isLoadingUsers && (!users?.items || users.items.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">
                {searchQuery && "검색 결과가 없습니다"}
                {!searchQuery && "사용자가 없습니다"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 페이지네이션 */}
      {users && users.pages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination
            currentPage={userPage}
            totalPages={users.pages ?? 1}
            onPageChange={setUserPage}
            isLoading={isLoadingUsers}
          />
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        그룹을 관리할 관리자를 선택하세요 (전체 {users?.total ?? 0}명)
      </p>
    </div>
  );
}
