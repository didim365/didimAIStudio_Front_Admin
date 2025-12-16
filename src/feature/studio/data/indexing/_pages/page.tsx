"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
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
  Plus,
  FileText,
  Folder,
  Database,
  Calendar,
  FileArchive,
  TrendingUp,
} from "lucide-react";
import { useQueryParam } from "@/shared/hooks/useQueryParams";
import { paths } from "@/shared/types/api/indexing";

type GetCategoriesResponse =
  paths["/v1/documents/categories"]["get"]["responses"]["200"]["content"]["application/json"];

interface IndexingPageProps {
  categories: GetCategoriesResponse;
}

/**
 * 바이트를 읽기 쉬운 형식으로 변환
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
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

  // Categories 통계 계산
  const totalCategories = categories?.length || 0;
  const totalDocuments =
    categories?.reduce((sum, cat) => sum + (cat.document_count || 0), 0) || 0;
  const totalSize =
    categories?.reduce((sum, cat) => sum + (cat.total_size || 0), 0) || 0;
  const avgRetentionPeriod =
    categories?.length > 0
      ? Math.round(
          categories.reduce(
            (sum, cat) => sum + (cat.retention_period || 0),
            0
          ) / categories.length
        )
      : 0;

  // 검색 필터링
  const filteredCategories =
    categories?.filter((category) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      switch (searchType) {
        case "id":
          return String(category.category_id).includes(query);
        case "description":
          return category.description?.toLowerCase().includes(query);
        case "name":
        default:
          return category.category_name?.toLowerCase().includes(query);
      }
    }) || [];

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          RAG 문서 데이터 관리
        </h1>
        <p className="mt-2 text-muted-foreground">
          등록된 모든 RAG 문서 데이터를 관리합니다
        </p>
      </div>

      {/* Categories 현황 요약 */}
      {categories && categories.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                총 카테고리 수
              </CardTitle>
              <Folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCategories}</div>
              <p className="text-xs text-muted-foreground">활성 카테고리</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 문서 수</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDocuments}</div>
              <p className="text-xs text-muted-foreground">등록된 문서</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                총 저장 용량
              </CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatBytes(totalSize)}</div>
              <p className="text-xs text-muted-foreground">전체 데이터 크기</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                평균 보관 기간
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgRetentionPeriod}일</div>
              <p className="text-xs text-muted-foreground">카테고리별 평균</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* 검색 바 */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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

      {/* Categories 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            카테고리 목록 ({filteredCategories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery
                  ? "검색 결과가 없습니다"
                  : "등록된 카테고리가 없습니다"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCategories.map((category) => (
                <Card
                  key={category.category_id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">
                          {category.category_name}
                        </CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          ID: {category.category_id}
                        </Badge>
                      </div>
                      <FileArchive className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* 설명 */}
                      {category.description && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            {category.description}
                          </p>
                        </div>
                      )}

                      <Separator />

                      {/* 통계 정보 */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <FileText className="h-3 w-3" />
                            <span>문서 수</span>
                          </div>
                          <p className="text-lg font-semibold">
                            {category.document_count || 0}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Database className="h-3 w-3" />
                            <span>저장 용량</span>
                          </div>
                          <p className="text-lg font-semibold">
                            {formatBytes(category.total_size || 0)}
                          </p>
                        </div>

                        <div className="space-y-1 col-span-2">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>보관 기간</span>
                          </div>
                          <p className="text-lg font-semibold">
                            {category.retention_period || 0}일
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">로딩 중...</p>
            </div>
          )}
          {!isLoading && documents.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">등록된 문서가 없습니다</p>
            </div>
          )}
          {!isLoading && documents.length > 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">문서 테이블 구현 필요</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
