"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Search, UserPlus } from "lucide-react";
import { useGetUsers } from "../hooks/useGetUsers";
import { UsersTable } from "../components/UsersTable";
import { useQueryParam } from "@/shared/hooks/useQueryParams";
import { Pagination } from "@/shared/ui/pagination";
import Link from "next/link";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useQueryParam<string>("search", "", {
    debounce: 300,
  });
  const [page, setPage] = useQueryParam<number>("page", 1);

  const { data: usersData, isLoading } = useGetUsers({
    search: searchQuery || undefined,
    page,
    size: 20,
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
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="회원명을 입력해주세요."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Link href="/users/add">
                <Button className="gap-2 cursor-pointer">
                  <UserPlus className="h-4 w-4" />
                  회원 추가
                </Button>
              </Link>
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
      {usersData && usersData.pages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={usersData.page}
            totalPages={usersData.pages}
            onPageChange={(newPage) => setPage(newPage)}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}
