"use client";

import { useRouter } from "next/navigation";
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
import { Search, RefreshCw, UserPlus } from "lucide-react";
import { components } from "@/shared/types/api/agents";
import { PersonasTable } from "../components/PersonasTable";
import useGetPersonas from "../hooks/useGetPersonas";
import { useQueryParam } from "@/shared/hooks/useQueryParams";
import { Pagination } from "@/shared/ui/pagination";
import Link from "next/link";

export default function PersonasPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useQueryParam<string>("search", "", {
    debounce: 300,
  });
  const [categoryFilter, setCategoryFilter] = useQueryParam<string>(
    "category",
    "all"
  );
  const [typeFilter, setTypeFilter] = useQueryParam<string>("type", "all");
  const [publicFilter, setPublicFilter] = useQueryParam<string>(
    "public",
    "all"
  );
  const [page, setPage] = useQueryParam<number>("page", 1);

  const queryParams = {
    page,
    category:
      categoryFilter === "all"
        ? undefined
        : [categoryFilter as components["schemas"]["PersonaCategoryEnum"]],
    is_system: typeFilter === "all" ? undefined : typeFilter === "system",
    is_public: publicFilter === "all" ? undefined : publicFilter === "public",
    name: searchQuery || undefined,
  };

  const { data, isLoading, refetch } = useGetPersonas(queryParams);

  const personas = data?.items || [];

  const handleViewDetails = (personaId: number) => {
    router.push(`/studio/personas/${personaId}`);
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">페르소나 관리</h1>
        <p className="mt-2 text-slate-600">
          등록된 모든 페르소나 데이터를 관리합니다
        </p>
      </div>

      {/* 검색 및 필터 */}
      <Card className="mb-6">
        <CardContent>
          <div className="flex flex-col gap-4">
            {/* 검색 바 */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="이름으로 검색..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1); // 검색 시 첫 페이지로 리셋
                  }}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Link href="/studio/personas/add">
                  <Button className="gap-2 cursor-pointer">
                    <UserPlus className="h-4 w-4" />
                    페르소나 생성
                  </Button>
                </Link>
              </div>
            </div>

            {/* 필터 옵션 */}
            <div className="flex flex-wrap gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="카테고리 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 카테고리</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Medical">의료</SelectItem>
                  <SelectItem value="Education">교육</SelectItem>
                  <SelectItem value="Finance">금융</SelectItem>
                  <SelectItem value="Marketing">마케팅</SelectItem>
                  <SelectItem value="Art">예술</SelectItem>
                  <SelectItem value="Engineering">공학</SelectItem>
                  <SelectItem value="Legal">법률</SelectItem>
                  <SelectItem value="Science">과학</SelectItem>
                  <SelectItem value="Sports">스포츠</SelectItem>
                  <SelectItem value="Environment">환경</SelectItem>
                  <SelectItem value="Media">미디어</SelectItem>
                  <SelectItem value="Culinary">요리</SelectItem>
                  <SelectItem value="Politics">정치</SelectItem>
                  <SelectItem value="Psychology">심리</SelectItem>
                  <SelectItem value="Fashion">패션</SelectItem>
                  <SelectItem value="Travel">여행</SelectItem>
                  <SelectItem value="Agriculture">농업</SelectItem>
                  <SelectItem value="Gaming">게임</SelectItem>
                  <SelectItem value="Automotive">자동차</SelectItem>
                  <SelectItem value="CUSTOM">커스텀</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="타입 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 타입</SelectItem>
                  <SelectItem value="system">시스템 제공</SelectItem>
                  <SelectItem value="user">사용자 생성</SelectItem>
                </SelectContent>
              </Select>

              <Select value={publicFilter} onValueChange={setPublicFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="공개 상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 상태</SelectItem>
                  <SelectItem value="public">공개</SelectItem>
                  <SelectItem value="private">비공개</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="gap-2"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                새로고침
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 페르소나 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            페르소나 목록 ({personas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-slate-500">로딩 중...</p>
            </div>
          )}
          {!isLoading && (
            <PersonasTable
              personas={personas}
              onViewDetails={handleViewDetails}
            />
          )}
        </CardContent>
      </Card>

      {/* 페이지네이션 */}
      {data && data.total_pages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={data.page}
            totalPages={data.total_pages}
            onPageChange={(newPage) => setPage(newPage)}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}
