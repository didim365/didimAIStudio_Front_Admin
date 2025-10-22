"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Search, Filter, UserPlus } from "lucide-react";
import { useUsers } from "../hooks/useUsers";
import { UsersTable } from "./UsersTable";
import { UserEditDialog } from "./UserEditDialog";

export default function UsersPage() {
  const {
    searchQuery,
    setSearchQuery,
    selectedRole,
    setSelectedRole,
    selectedUser,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDarkMode,
    filteredUsers,
    handleEditUser,
  } = useUsers();

  return (
    <div className="p-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ color: isDarkMode ? "#ffffff" : undefined }}
        >
          회원 관리
        </h1>
        <p
          className="mt-2"
          style={{ color: isDarkMode ? "#cccccc" : undefined }}
        >
          회원 정보 조회 및 권한, 사용량 제한 설정
        </p>
      </div>

      {/* 검색 및 필터 */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="이름, 이메일, 그룹으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="권한 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 권한</SelectItem>
                  <SelectItem value="관리자">관리자</SelectItem>
                  <SelectItem value="매니저">매니저</SelectItem>
                  <SelectItem value="일반 사용자">일반 사용자</SelectItem>
                </SelectContent>
              </Select>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                회원 추가
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 사용자 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            전체 회원 ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UsersTable
            users={filteredUsers}
            isDarkMode={isDarkMode}
            onEditUser={handleEditUser}
          />
        </CardContent>
      </Card>

      {/* 사용자 수정 다이얼로그 */}
      <UserEditDialog
        user={selectedUser}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
    </div>
  );
}
