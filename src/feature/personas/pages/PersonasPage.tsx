"use client";

import { useState } from "react";
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
import {
  Search,
  RefreshCw,
  UserPlus,
  Lock,
  Unlock,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { PersonaCategoryEnum } from "../api/getPersona";
import useGetPersonas from "../hooks/useGetPersonas";
import { useQueryParam } from "@/shared/hooks/useQueryParams";
import { Pagination } from "@/shared/ui/pagination";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";
import { categoryConfig, CATEGORY_OPTIONS } from "../constants/categoryConfig";
import { parseBooleanFilter } from "@/feature/studio/agents/utils/parseBooleanFilter";

export default function PersonasPage() {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 검색 필드들
  const [name, setName] = useQueryParam<string>("name", "", {
    debounce: 300,
  });
  const [description, setDescription] = useQueryParam<string>(
    "description",
    "",
    {
      debounce: 300,
    }
  );
  const [systemPrompt, setSystemPrompt] = useQueryParam<string>(
    "system_prompt",
    "",
    {
      debounce: 300,
    }
  );

  // 필터 옵션들
  const [categoryFilter, setCategoryFilter] = useQueryParam<string>(
    "category",
    "all",
    { debounce: 0 }
  );
  const [publicFilter, setPublicFilter] = useQueryParam<string>(
    "public",
    "all"
  );

  // 검색 조건 결합 연산자
  const [operationType, setOperationType] = useQueryParam<string>(
    "operation_type",
    "all"
  );

  // 정렬
  const [sortBy, setSortBy] = useQueryParam<string>("sort_by", "none");
  const [order, setOrder] = useQueryParam<string>("order", "ASC");

  // 페이지네이션
  const [page, setPage] = useQueryParam<number>("page", 1);
  const [size, setSize] = useQueryParam<number>("size", 20);

  const queryParams = {
    name: name || undefined,
    description: description || undefined,
    system_prompt: systemPrompt || undefined,
    category:
      categoryFilter === "all"
        ? undefined
        : [categoryFilter as PersonaCategoryEnum],
    is_system: true,
    is_public: parseBooleanFilter(publicFilter),
    operation_type:
      operationType === "all" ? undefined : (operationType as "AND" | "OR"),
    sort_by: sortBy === "none" ? undefined : sortBy || undefined,
    order: (order as "ASC" | "DESC") || undefined,
    page,
    size,
  };

  const { data, isLoading, refetch } = useGetPersonas(queryParams);

  const handleViewDetails = (personaId: number) => {
    router.push(`/studio/personas/${personaId}`);
  };

  const handleRefresh = () => {
    refetch();
  };

  // 필터 초기화
  const handleResetFilters = () => {
    setName("");
    setDescription("");
    setSystemPrompt("");
    setCategoryFilter("all");
    setPublicFilter("all");
    setOperationType("all");
    setSortBy("none");
    setOrder("ASC");
    setPage(1);
    setSize(20);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
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
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              검색
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                {isFilterOpen ? "필터 닫기" : "필터 열기"}
                {isFilterOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                필터 초기화
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* 검색 필드 */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="이름 검색"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="설명 검색"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="시스템 프롬프트 검색"
                    value={systemPrompt}
                    onChange={(e) => {
                      setSystemPrompt(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Link href="/studio/personas/add">
                  <Button className="gap-2 cursor-pointer">
                    <UserPlus className="h-4 w-4" />
                    페르소나 생성
                  </Button>
                </Link>
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

            {/* 필터 */}
            {isFilterOpen && (
              <div className="space-y-6 pt-4 border-t">
                {/* 카테고리 및 불린 필터 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      카테고리
                    </label>
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="전체" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        {CATEGORY_OPTIONS.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {categoryConfig[cat]?.label || cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      공개 여부
                    </label>
                    <Select
                      value={publicFilter}
                      onValueChange={setPublicFilter}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="전체" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="true">공개</SelectItem>
                        <SelectItem value="false">비공개</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      검색 조건 결합
                    </label>
                    <Select
                      value={operationType}
                      onValueChange={setOperationType}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="기본값" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">기본값</SelectItem>
                        <SelectItem value="AND">
                          AND (모든 조건 만족)
                        </SelectItem>
                        <SelectItem value="OR">OR (하나 이상 만족)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 정렬 및 페이지 크기 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      정렬 기준
                    </label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="정렬 기준 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">기본값</SelectItem>
                        <SelectItem value="id">ID</SelectItem>
                        <SelectItem value="name">이름</SelectItem>
                        <SelectItem value="category">카테고리</SelectItem>
                        <SelectItem value="created_at">생성일</SelectItem>
                        <SelectItem value="updated_at">수정일</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      정렬 순서
                    </label>
                    <Select value={order} onValueChange={setOrder}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ASC">오름차순</SelectItem>
                        <SelectItem value="DESC">내림차순</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      페이지 크기
                    </label>
                    <Select
                      value={String(size)}
                      onValueChange={(v) => setSize(Number(v))}
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
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 페르소나 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            페르소나 목록 ({data?.total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isLoading && (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead className="min-w-[200px]">
                      페르소나 제목
                    </TableHead>
                    <TableHead className="min-w-[250px]">설명</TableHead>
                    <TableHead className="w-[120px]">카테고리</TableHead>
                    <TableHead className="w-[100px] text-center">
                      공개
                    </TableHead>
                    <TableHead className="w-[120px]">생성일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.items.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-12 text-slate-500"
                      >
                        등록된 페르소나가 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                  {data?.items.map((persona) => {
                    return (
                      <TableRow
                        key={persona.id}
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => handleViewDetails(persona.id)}
                      >
                        <TableCell className="font-mono text-sm text-slate-600">
                          {persona.id}
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold line-clamp-2 text-slate-900">
                            {persona.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm line-clamp-2 text-slate-700">
                            {persona.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              categoryConfig[persona.category]?.color ||
                              "bg-gray-100 text-gray-800"
                            }
                          >
                            {categoryConfig[persona.category]?.label ||
                              persona.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            {persona.is_public && (
                              <Badge
                                variant="outline"
                                className="bg-teal-100 text-teal-800"
                              >
                                <Unlock className="h-3 w-3 mr-1" />
                                공개
                              </Badge>
                            )}
                            {!persona.is_public && (
                              <Badge
                                variant="outline"
                                className="bg-orange-100 text-orange-800"
                              >
                                <Lock className="h-3 w-3 mr-1" />
                                비공개
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {formatDate(persona.created_at)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
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
