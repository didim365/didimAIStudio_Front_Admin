"use client";

import { useState } from "react";
import { Input } from "@/shared/ui/input";
import { Check, Search, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetUsers } from "@/feature/users/_hooks/useGetUsers";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

interface ManagerSelectProps {
  value?: number;
  onChange: (value: number | undefined) => void;
  className?: string;
}

export default function ManagerSelect({
  value,
  onChange,
  className,
}: ManagerSelectProps) {
  // 검색 및 페이지네이션 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [userPage, setUserPage] = useState(1);

  // 사용자 목록 조회
  const { data: users, isLoading: isLoadingUsers } = useGetUsers({
    page: userPage,
    page_size: 10,
    q: searchQuery ?? undefined,
  });

  // 검색어 변경 시 첫 페이지로 리셋
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setUserPage(1);
  };

  return (
    <div className={cn("flex flex-col gap-2 h-full", className)}>
      {/* 사용자 목록 */}
      <div className="border rounded-md overflow-hidden flex-1 flex flex-col">
        {/* 검색 */}
        <div className="relative px-2 py-2 border-b shrink-0 flex items-center">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="이름 또는 이메일 검색..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {users?.items?.map((user) => {
            const isSelected = value === user.id;
            return (
              <div
                key={user.id}
                className={cn(
                  "flex items-center py-1.5 px-2 rounded-md cursor-pointer hover:bg-accent/50 transition-colors mx-1",
                  isSelected && "bg-accent"
                )}
                onClick={() => onChange(isSelected ? undefined : user.id)}
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted shrink-0 mr-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <span
                  className={cn(
                    "flex-1 text-sm truncate select-none",
                    isSelected && "font-medium"
                  )}
                >
                  {user.full_name ?? user.email}
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
          * 사용자를 클릭하여 관리자를 선택하세요.
        </p>
        {users && users.total_pages > 1 && (
          <div className="flex items-center gap-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setUserPage((p) => Math.max(1, p - 1))}
              disabled={userPage === 1 || isLoadingUsers}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs text-muted-foreground px-1">
              {userPage}/{users.total_pages}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() =>
                setUserPage((p) => Math.min(users.total_pages ?? 1, p + 1))
              }
              disabled={userPage === users.total_pages || isLoadingUsers}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
