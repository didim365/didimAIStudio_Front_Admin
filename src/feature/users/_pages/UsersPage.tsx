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
import { Search, UserPlus, Filter, ArrowUpDown } from "lucide-react";
import { useGetUsers } from "../_hooks/useGetUsers";
import { UsersTable } from "../_components/UsersTable";
import { useQueryParam } from "@/shared/hooks/useQueryParams";
import { Pagination } from "@/shared/ui/pagination";
import Link from "next/link";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useQueryParam<string>("search", "", {
    debounce: 300,
  });
  const [page, setPage] = useQueryParam<number>("page", 1);
  const [status, setStatus] = useQueryParam<string>("status", "all");
  const [pageSize, setPageSize] = useQueryParam<number>("pageSize", 20);
  const [sortBy, setSortBy] = useQueryParam<string>("sortBy", "created_at");
  const [sortOrder, setSortOrder] = useQueryParam<string>("sortOrder", "desc");

  const { data: usersData, isLoading } = useGetUsers({
    q: searchQuery || undefined,
    status: status !== "all" ? status : undefined,
    page,
    page_size: pageSize,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">회원 관리</h1>
        <p className="mt-2">회원 정보 조회 및 역할 설정</p>
      </div>

      {/* 검색 및 필터 */}
      <Card className="mb-6">
        <CardContent className="space-y-4">
          {/* 검색 및 회원 추가 */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="이메일 또는 이름으로 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Link href="/users/add">
              <Button className="gap-2 cursor-pointer whitespace-nowrap">
                <UserPlus className="h-4 w-4" />
                회원 추가
              </Button>
            </Link>
          </div>

          {/* 필터 옵션 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 상태 필터 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                상태
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="ACTIVE">활성</SelectItem>
                  <SelectItem value="INACTIVE">비활성</SelectItem>
                  <SelectItem value="SUSPENDED">정지</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 페이지 크기 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                표시 개수
              </label>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => setPageSize(Number(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10개</SelectItem>
                  <SelectItem value="20">20개</SelectItem>
                  <SelectItem value="50">50개</SelectItem>
                  <SelectItem value="100">100개</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 정렬 기준 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                정렬 기준
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">생성일</SelectItem>
                  <SelectItem value="email">이메일</SelectItem>
                  <SelectItem value="full_name">이름</SelectItem>
                  <SelectItem value="last_login">마지막 로그인</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 정렬 순서 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                정렬 순서
              </label>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">내림차순</SelectItem>
                  <SelectItem value="asc">오름차순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 사용자 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            전체 회원 {!isLoading && usersData?.total}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UsersTable users={usersData?.items ?? []} />
        </CardContent>
      </Card>

      {/* 페이지네이션 */}
      {usersData && usersData.total_pages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={usersData.page}
            totalPages={usersData.total_pages}
            onPageChange={(newPage) => setPage(newPage)}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}

