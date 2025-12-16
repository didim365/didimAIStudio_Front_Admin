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
import { Search, RefreshCw, Plus } from "lucide-react";
import { useQueryParam } from "@/shared/hooks/useQueryParams";
import { ScenariosTable } from "../_components/ScenariosTable";
import Link from "next/link";
import { useGetScenarios } from "../_hooks/useGetScenarios";
import { usePathname } from "next/navigation";

export default function ScenariosPage() {
  const pathname = usePathname();
  const basePath = pathname?.startsWith("/studio/data")
    ? "/studio/data"
    : "/studio/templates";
  // URL 쿼리 파라미터 관리
  const [searchQuery, setSearchQuery] = useQueryParam<string>("search", "", {
    debounce: 300,
  });
  const [searchType, setSearchType] = useQueryParam<string>(
    "searchType",
    "name"
  );
  const [page, setPage] = useQueryParam<number>("page", 1);
  const pageSize = 20;

  // API 쿼리 파라미터 구성
  const queryParams = {
    page,
    size: pageSize,
    is_system: true,
    name: searchType === "name" ? searchQuery || undefined : undefined,
  };

  // API 호출
  const { data, isLoading, refetch } = useGetScenarios(queryParams);

  const scenarios = data?.items || [];

  // 클라이언트 사이드 필터링 (검색 타입이 ID나 description일 경우)
  const filteredScenarios = scenarios.filter((scenario) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    switch (searchType) {
      case "id":
        return scenario.id.toString().includes(query);
      case "description":
        return scenario.description?.toLowerCase().includes(query) || false;
      default:
        return true; // name은 이미 서버에서 필터링됨
    }
  });

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">시나리오 템플릿 관리</h1>
        <p className="mt-2 text-slate-600">
          등록된 모든 시나리오 템플릿을 관리합니다
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
                  placeholder={
                    searchType === "id"
                      ? "ID로 검색..."
                      : searchType === "description"
                      ? "설명으로 검색..."
                      : "이름으로 검색..."
                  }
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Link href={`${basePath}/scenarios/add`}>
                  <Button className="gap-2 cursor-pointer">
                    <Plus className="h-4 w-4" />
                    시나리오 생성
                  </Button>
                </Link>
              </div>
            </div>

            {/* 필터 옵션 */}
            <div className="flex flex-wrap gap-2">
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="검색 타입" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">시나리오 이름</SelectItem>
                  <SelectItem value="id">시나리오 ID</SelectItem>
                  <SelectItem value="description">시나리오 설명</SelectItem>
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

      {/* 시나리오 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            시나리오 목록 ({filteredScenarios.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-slate-500">로딩 중...</p>
            </div>
          )}
          {!isLoading && <ScenariosTable scenarios={filteredScenarios} />}
        </CardContent>
      </Card>

      {/* 페이지네이션 */}
      {data && data.total_pages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1 || isLoading}
          >
            이전
          </Button>
          <div className="flex items-center gap-2 px-4">
            <span className="text-sm text-slate-600">
              {data.page} / {data.total_pages}
            </span>
          </div>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page === data.total_pages || isLoading}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}
