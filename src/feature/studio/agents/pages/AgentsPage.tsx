"use client";

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
  User,
  Bot,
  Filter,
  X,
} from "lucide-react";
import { useGetAgents } from "../hooks/useGetAgents";
import { useQueryParam } from "@/shared/hooks/useQueryParams";
import { Pagination } from "@/shared/ui/pagination";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { categoryConfig, CATEGORY_OPTIONS } from "../constants/categoryConfig";
import { formatDate } from "@/shared/utils/formatDate";
import { useMemo } from "react";

// 배열 파라미터를 파싱하는 헬퍼 함수
const parseArrayParam = (value: string): number[] | undefined => {
  if (!value || value.trim() === "") return undefined;
  const parsed = value
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v !== "")
    .map((v) => Number(v))
    .filter((v) => !isNaN(v));
  return parsed.length > 0 ? parsed : undefined;
};

const parseStringArrayParam = (value: string): string[] | undefined => {
  if (!value || value.trim() === "") return undefined;
  const parsed = value
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v !== "");
  return parsed.length > 0 ? parsed : undefined;
};

export default function AgentsPage() {
  const router = useRouter();

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
  const [userAgentTitle, setUserAgentTitle] = useQueryParam<string>(
    "user_agent_title",
    "",
    { debounce: 300 }
  );
  const [userAgentDescription, setUserAgentDescription] = useQueryParam<string>(
    "user_agent_description",
    "",
    { debounce: 300 }
  );

  // 배열 필터들 (콤마로 구분된 문자열로 입력)
  const [idFilter, setIdFilter] = useQueryParam<string>("id", "", {
    debounce: 300,
  });
  const [userIdFilter, setUserIdFilter] = useQueryParam<string>("user_id", "", {
    debounce: 300,
  });
  const [modelIdFilter, setModelIdFilter] = useQueryParam<string>(
    "model_my_page_id",
    "",
    { debounce: 300 }
  );
  const [personaIdFilter, setPersonaIdFilter] = useQueryParam<string>(
    "persona_my_page_id",
    "",
    { debounce: 300 }
  );
  const [toolIdFilter, setToolIdFilter] = useQueryParam<string>(
    "tool_my_page_id",
    "",
    { debounce: 300 }
  );
  const [fallbackModelIdFilter, setFallbackModelIdFilter] =
    useQueryParam<string>("fallback_model_my_page_id", "", { debounce: 300 });

  // 카테고리 (다중 선택을 위해 콤마로 구분)
  const [categoryFilter, setCategoryFilter] = useQueryParam<string>(
    "category",
    "",
    { debounce: 0 }
  );

  // 불린 필터들
  const [isSystemFilter, setIsSystemFilter] = useQueryParam<string>(
    "is_system",
    "all"
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
  const params = useMemo(() => {
    const categoryArray = categoryFilter
      ? (categoryFilter
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c !== "") as any[])
      : undefined;

    return {
      name: name || undefined,
      description: description || undefined,
      user_agent_title: userAgentTitle || undefined,
      user_agent_description: userAgentDescription || undefined,
      id: parseArrayParam(idFilter),
      user_id: parseStringArrayParam(userIdFilter),
      model_my_page_id: parseArrayParam(modelIdFilter),
      persona_my_page_id: parseArrayParam(personaIdFilter),
      tool_my_page_id: parseArrayParam(toolIdFilter),
      fallback_model_my_page_id: parseArrayParam(fallbackModelIdFilter),
      category: categoryArray,
      is_system:
        isSystemFilter === "all"
          ? undefined
          : isSystemFilter === "true"
          ? true
          : isSystemFilter === "false"
          ? false
          : undefined,
      is_public:
        isPublicFilter === "all"
          ? undefined
          : isPublicFilter === "true"
          ? true
          : isPublicFilter === "false"
          ? false
          : undefined,
      operation_type:
        operationType === "all" ? undefined : (operationType as "AND" | "OR"),
      sort_by: sortBy === "none" ? undefined : sortBy || undefined,
      order: (order as "ASC" | "DESC") || undefined,
      page,
      size,
    };
  }, [
    name,
    description,
    userAgentTitle,
    userAgentDescription,
    idFilter,
    userIdFilter,
    modelIdFilter,
    personaIdFilter,
    toolIdFilter,
    fallbackModelIdFilter,
    categoryFilter,
    isSystemFilter,
    isPublicFilter,
    operationType,
    sortBy,
    order,
    page,
    size,
  ]);

  const { data: agentsData, isLoading } = useGetAgents(params);

  const handleViewDetails = (agentId: number) => {
    router.push(`/studio/agents/${agentId}`);
  };

  // 필터 초기화
  const handleResetFilters = () => {
    setName("");
    setDescription("");
    setUserAgentTitle("");
    setUserAgentDescription("");
    setIdFilter("");
    setUserIdFilter("");
    setModelIdFilter("");
    setPersonaIdFilter("");
    setToolIdFilter("");
    setFallbackModelIdFilter("");
    setCategoryFilter("");
    setIsSystemFilter("all");
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
              <Filter className="h-5 w-5" />
              검색 및 필터
            </CardTitle>
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
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* 기본 검색 필드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="사용자 제목 검색"
                  value={userAgentTitle}
                  onChange={(e) => setUserAgentTitle(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="사용자 설명 검색"
                  value={userAgentDescription}
                  onChange={(e) => setUserAgentDescription(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* ID 필터들 (콤마로 구분) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  에이전트 ID (콤마로 구분)
                </label>
                <Input
                  placeholder="예: 1, 2, 3"
                  value={idFilter}
                  onChange={(e) => setIdFilter(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  사용자 ID (콤마로 구분)
                </label>
                <Input
                  placeholder="예: user1, user2"
                  value={userIdFilter}
                  onChange={(e) => setUserIdFilter(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  모델 ID (콤마로 구분)
                </label>
                <Input
                  placeholder="예: 1, 2, 3"
                  value={modelIdFilter}
                  onChange={(e) => setModelIdFilter(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  페르소나 ID (콤마로 구분)
                </label>
                <Input
                  placeholder="예: 1, 2, 3"
                  value={personaIdFilter}
                  onChange={(e) => setPersonaIdFilter(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  도구 ID (콤마로 구분)
                </label>
                <Input
                  placeholder="예: 1, 2, 3"
                  value={toolIdFilter}
                  onChange={(e) => setToolIdFilter(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Fallback 모델 ID (콤마로 구분)
                </label>
                <Input
                  placeholder="예: 1, 2, 3"
                  value={fallbackModelIdFilter}
                  onChange={(e) => setFallbackModelIdFilter(e.target.value)}
                />
              </div>
            </div>

            {/* 카테고리 및 불린 필터 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  카테고리 (콤마로 구분)
                </label>
                <Input
                  placeholder="예: CHATBOT, REACT"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                />
                <div className="mt-2 flex flex-wrap gap-1">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const isSelected = categoryFilter
                      .split(",")
                      .map((c) => c.trim())
                      .includes(cat);
                    return (
                      <Badge
                        key={cat}
                        variant={isSelected ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          const categories = categoryFilter
                            .split(",")
                            .map((c) => c.trim())
                            .filter((c) => c !== "");
                          if (isSelected) {
                            setCategoryFilter(
                              categories.filter((c) => c !== cat).join(", ")
                            );
                          } else {
                            setCategoryFilter([...categories, cat].join(", "));
                          }
                        }}
                      >
                        {categoryConfig[cat]?.label || cat}
                      </Badge>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  시스템 제공
                </label>
                <Select
                  value={isSystemFilter}
                  onValueChange={setIsSystemFilter}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="전체" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="true">시스템 제공</SelectItem>
                    <SelectItem value="false">사용자 생성</SelectItem>
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
                <Select value={operationType} onValueChange={setOperationType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="기본값" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">기본값</SelectItem>
                    <SelectItem value="AND">AND (모든 조건 만족)</SelectItem>
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
                <TableRow className="bg-slate-50">
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead className="min-w-[200px]">에이전트 이름</TableHead>
                  <TableHead className="min-w-[250px]">설명</TableHead>
                  <TableHead className="w-[140px]">카테고리</TableHead>
                  <TableHead className="min-w-[180px]">사용자 커스텀</TableHead>
                  <TableHead className="w-[100px] text-center">타입</TableHead>
                  <TableHead className="w-[100px] text-center">공개</TableHead>
                  <TableHead className="w-[120px]">생성일</TableHead>
                  <TableHead className="w-[120px]">수정일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agentsData?.items.map((agent) => {
                  const agentTitle = agent.user_agent_title ?? agent.name;
                  const agentDescription =
                    agent.user_agent_description ?? agent.description;
                  const isCustomTitle = !!agent.user_agent_title;
                  const isCustomDescription = !!agent.user_agent_description;

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
                        <div
                          className={cn(
                            "font-semibold line-clamp-2 text-slate-900",
                            isCustomTitle &&
                              "text-blue-700 flex items-center gap-1.5"
                          )}
                        >
                          {isCustomTitle && (
                            <User className="h-4 w-4 shrink-0 text-blue-600" />
                          )}
                          {agentTitle}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={cn(
                            "text-sm line-clamp-2 text-slate-700",
                            isCustomDescription &&
                              "text-blue-700 flex items-start gap-1.5"
                          )}
                        >
                          {isCustomDescription && (
                            <User className="h-4 w-4 shrink-0 mt-0.5 text-blue-600" />
                          )}
                          {agentDescription}
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
                      <TableCell className="text-sm text-slate-600">
                        {(agent.user_agent_title ||
                          agent.user_agent_description) && (
                          <div className="flex items-center gap-1 text-green-600">
                            <Shield className="h-4 w-4" />
                            커스터마이징됨
                          </div>
                        )}
                        {!agent.user_agent_title &&
                          !agent.user_agent_description && (
                            <span className="text-slate-400">기본</span>
                          )}
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
