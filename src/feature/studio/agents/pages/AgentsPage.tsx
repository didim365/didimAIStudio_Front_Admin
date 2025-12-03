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
import { Search, Shield, Lock, Unlock, User, Bot } from "lucide-react";
import { useGetAgents } from "../hooks/useGetAgents";
import { useQueryParam } from "@/shared/hooks/useQueryParams";
import { Pagination } from "@/shared/ui/pagination";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { categoryConfig } from "../constants/categoryConfig";
import { paths } from "@/shared/types/api/agents";

export default function AgentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useQueryParam<string>("search", "", {
    debounce: 300,
  });
  const [page, setPage] = useQueryParam<number>("page", 1);

  const { data: agentsData, isLoading } = useGetAgents({
    name: searchQuery || undefined,
    page,
    size: 20,
  });

  const agents = agentsData?.items ?? [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleViewDetails = (agentId: number) => {
    router.push(`/studio/agents/${agentId}`);
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
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="에이전트 이름을 입력해주세요."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
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
                {agents.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-12 text-slate-500"
                    >
                      등록된 에이전트가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
                {agents.map((agent) => {
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
