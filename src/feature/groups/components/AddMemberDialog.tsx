"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Skeleton } from "@/shared/ui/skeleton";
import { Pagination } from "@/shared/ui/pagination";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { UserPlus, Search, Check, Loader2 } from "lucide-react";
import { useGetUsers } from "@/feature/users/hooks/useGetUsers";
import { usePostGroupUser } from "../hooks/usePostGroupUser";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/shared/lib/utils";
import { getInitials } from "@/feature/users/utils/getInitials";

interface AddMemberDialogProps {
  groupId: number;
}

export default function AddMemberDialog({ groupId }: AddMemberDialogProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>();

  // 사용자 목록 조회
  const { data: users, isLoading: isLoadingUsers } = useGetUsers({
    page: userPage,
    size: 10,
    search: searchQuery || undefined,
  });

  // 그룹 멤버 추가 mutation
  const { mutate: addGroupUser, isPending: isAddingMember } = usePostGroupUser({
    onSuccess: () => {
      // 그룹 정보 새로고침
      queryClient.invalidateQueries({
        queryKey: ["group", groupId],
      });
      // 다이얼로그 닫기 및 초기화
      setOpen(false);
      setSelectedUserId(undefined);
      setSearchQuery("");
      setUserPage(1);
    },
  });

  // 검색어 변경 시 첫 페이지로 리셋
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setUserPage(1);
  };

  const handleAddMember = () => {
    if (!selectedUserId) return;

    addGroupUser({
      group_id: groupId,
      user_id: selectedUserId,
      status: "ACTIVE",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <UserPlus className="h-4 w-4" />
          멤버 추가
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            그룹 멤버 추가
          </DialogTitle>
          <DialogDescription>
            그룹에 추가할 사용자를 검색하고 선택하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 검색 입력 */}
          <div className="space-y-2">
            <Label htmlFor="userSearch">사용자 검색</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="userSearch"
                placeholder="이름 또는 이메일로 검색..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
                disabled={isAddingMember}
              />
            </div>
          </div>

          {/* 사용자 목록 */}
          <div className="space-y-2">
            <Label>사용자 선택</Label>
            <div className="border rounded-lg max-h-[300px] overflow-y-auto">
              {isLoadingUsers && (
                <div className="space-y-2 p-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              )}

              {!isLoadingUsers && users?.items && users.items.length > 0 && (
                <div className="p-2 space-y-2">
                  {users.items.map((user) => {
                    const isSelected = selectedUserId === user.id;
                    return (
                      <Button
                        key={user.id}
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start h-auto py-3 px-3",
                          isSelected && "border-primary bg-primary/5"
                        )}
                        onClick={() => setSelectedUserId(user.id)}
                        disabled={isAddingMember}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="text-xs">
                              {getInitials(user.full_name, user.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 text-left min-w-0">
                            <p className="font-medium text-sm truncate">
                              {user.full_name || user.email}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </p>
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

              {!isLoadingUsers &&
                (!users?.items || users.items.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">
                      {searchQuery && "검색 결과가 없습니다"}
                      {!searchQuery && "사용자가 없습니다"}
                    </p>
                  </div>
                )}
            </div>

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
              전체 {users?.total ?? 0}명의 사용자
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isAddingMember}
          >
            취소
          </Button>
          <Button
            type="submit"
            onClick={handleAddMember}
            disabled={!selectedUserId || isAddingMember}
          >
            {isAddingMember ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                추가 중...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                추가하기
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
