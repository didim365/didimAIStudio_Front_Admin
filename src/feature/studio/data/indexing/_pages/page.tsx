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
import { Search, RefreshCw, Plus, FileText } from "lucide-react";
import { useQueryParam } from "@/shared/hooks/useQueryParams";
import { paths } from "@/shared/types/api/indexing";

type GetCategoriesResponse =
  paths["/v1/documents/categories"]["get"]["responses"]["200"]["content"]["application/json"];

interface IndexingPageProps {
  categories: GetCategoriesResponse;
}

export default function IndexingPage({ categories }: IndexingPageProps) {
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

  // TODO: API 호출 훅 구현 필요
  const isLoading = false;
  const documents: any[] = [];

  const handleRefresh = () => {
    // TODO: refetch 구현 필요
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">RAG 문서 데이터 관리</h1>
        <p className="mt-2 text-slate-600">
          등록된 모든 RAG 문서 데이터를 관리합니다
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
                <Button className="gap-2 cursor-pointer">
                  <Plus className="h-4 w-4" />
                  문서 업로드
                </Button>
              </div>
            </div>

            {/* 필터 옵션 */}
            <div className="flex flex-wrap gap-2">
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="검색 타입" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">문서 이름</SelectItem>
                  <SelectItem value="id">문서 ID</SelectItem>
                  <SelectItem value="description">문서 설명</SelectItem>
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

      {/* 문서 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            문서 목록 ({documents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-slate-500">로딩 중...</p>
            </div>
          )}
          {!isLoading && documents.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">등록된 문서가 없습니다</p>
            </div>
          )}
          {!isLoading && documents.length > 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">문서 테이블 구현 필요</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
