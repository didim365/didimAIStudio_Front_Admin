"use client";

import { Activity, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";
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
  Shield,
  Lock,
  Unlock,
  Bot,
  Filter,
  X,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useGetAgents } from "../hooks/useGetAgents";
import { useQueryParam } from "@/shared/hooks/useQueryParams";
import { Pagination } from "@/shared/ui/pagination";
import { useRouter } from "next/navigation";
import { categoryConfig, CATEGORY_OPTIONS } from "../constants/categoryConfig";
import { formatDate } from "@/shared/utils/formatDate";
import { parseBooleanFilter } from "@/feature/studio/agents/utils/parseBooleanFilter";
import Link from "next/link";

export default function AgentsPage() {
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

  // 카테고리 (단일 선택)
  const [categoryFilter, setCategoryFilter] = useQueryParam<string>(
    "category",
    "all",
    { debounce: 0 }
  );

  const [isPublicFilter, setIsPublicFilter] = useQueryParam<string>(
    "is_public",
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

  // 파라미터 변환
  const params = {
    name: name || undefined,
    description: description || undefined,
    category:
      categoryFilter && categoryFilter !== "all"
        ? [categoryFilter as any]
        : undefined,
    is_system: true, // 항상 시스템 제공 에이전트만 조회
    is_public: parseBooleanFilter(isPublicFilter),
    operation_type:
      operationType === "all" ? undefined : (operationType as "AND" | "OR"),
    sort_by: sortBy === "none" ? undefined : sortBy || undefined,
    order: (order as "ASC" | "DESC") || undefined,
    page,
    size,
  };

  const { data: agentsData, isLoading } = useGetAgents(params);

  const handleViewDetails = (agentId: number) => {
    router.push(`/studio/templates/agents/${agentId}`);
  };

  // 필터 초기화
  const handleResetFilters = () => {
    setName("");
    setDescription("");
    setCategoryFilter("all");
    setIsPublicFilter("all");
    setOperationType("all");
    setSortBy("none");
    setOrder("ASC");
    setPage(1);
    setSize(20);
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">에이전트 관리</h1>
        <p className="mt-2">에이전트 정보 조회 및 관리</p>
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
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="에이전트 이름 검색"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="설명 검색"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Link href="/studio/templates/agents/add">
                  <Button className="gap-2 cursor-pointer">
                    <Plus className="h-4 w-4" />
                    에이전트 생성
                  </Button>
                </Link>
              </div>
            </div>

            {/* 필터 */}
            <Activity mode={isFilterOpen ? "visible" : "hidden"}>
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
                      value={isPublicFilter}
                      onValueChange={setIsPublicFilter}
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
            </Activity>
          </div>
        </CardContent>
      </Card>

      {/* 에이전트 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            전체 에이전트 {!isLoading && agentsData?.total}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead className="min-w-[200px]">에이전트 이름</TableHead>
                  <TableHead className="min-w-[250px]">설명</TableHead>
                  <TableHead className="w-[140px]">카테고리</TableHead>
                  <TableHead className="w-[100px] text-center">타입</TableHead>
                  <TableHead className="w-[100px] text-center">공개</TableHead>
                  <TableHead className="w-[120px]">생성일</TableHead>
                  <TableHead className="w-[120px]">수정일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agentsData?.items.map((agent) => {
                  return (
                    <TableRow
                      key={agent.id}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => handleViewDetails(agent.id)}
                    >
                      <TableCell className="font-mono text-sm text-slate-600">
                        {agent.id}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold line-clamp-2 text-slate-900">
                          {agent.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm line-clamp-2 text-slate-700">
                          {agent.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            categoryConfig[agent.category]?.color ||
                            "bg-gray-100 text-gray-800"
                          }
                        >
                          {categoryConfig[agent.category]?.label ||
                            agent.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          {agent.is_system && (
                            <Badge
                              variant="outline"
                              className="bg-purple-100 text-purple-800"
                            >
                              <Shield className="h-3 w-3 mr-1" />
                              시스템
                            </Badge>
                          )}
                          {!agent.is_system && (
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800"
                            >
                              <Bot className="h-3 w-3 mr-1" />
                              사용자
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          {agent.is_public && (
                            <Badge
                              variant="outline"
                              className="bg-teal-100 text-teal-800"
                            >
                              <Unlock className="h-3 w-3 mr-1" />
                              공개
                            </Badge>
                          )}
                          {!agent.is_public && (
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
                        {formatDate(agent.created_at)}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {formatDate(agent.updated_at)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 페이지네이션 */}
      {agentsData && agentsData.total_pages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={agentsData.page}
            totalPages={agentsData.total_pages}
            onPageChange={(newPage) => setPage(newPage)}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}
