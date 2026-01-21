"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Check, Search } from "lucide-react";
import { Pagination } from "@/shared/ui/pagination";
import { useGetUsers } from "@/feature/users/_hooks/useGetUsers";
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
    page_size: 30,
    q: searchQuery ?? undefined,
  });

  // 검색어 변경 시 첫 페이지로 리셋
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setUserPage(1);
  };

  return (
    <div className="space-y-4">
      {/* 상단: 검색 + 안내 */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="이름 또는 이메일로 검색..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          전체 {users?.total ?? 0}명
        </p>
      </div>

      {!isLoadingUsers && (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {users?.items?.map((user) => {
            const isSelected = value === user.id;
            return (
              <Button
                key={user.id}
                type="button"
                variant="outline"
                className={cn(
                  "justify-center h-auto py-3 px-4",
                  isSelected && "border-primary bg-primary/5"
                )}
                onClick={() => onChange(isSelected ? undefined : user.id)}
              >
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center text-center min-w-0">
                    <span className="font-medium truncate max-w-full">
                      {user.full_name ?? user.email}
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-full">
                      {user.email}
                    </span>
                  </div>
                  {isSelected && (
                    <Check className="h-5 w-5 text-primary shrink-0" />
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      )}
      {/* 페이지네이션 */}
      {users && users.total_pages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination
            currentPage={userPage}
            totalPages={users.total_pages ?? 1}
            onPageChange={setUserPage}
            isLoading={isLoadingUsers}
          />
        </div>
      )}
    </div>
  );
}
