"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
import { Button } from "@/shared/ui/button";
import { Database, Layers, RefreshCw } from "lucide-react";
import { useGetCollections } from "../_hooks/useGetCollections";
import { useQueryParam } from "@/shared/hooks/useQueryParams";
import { Pagination } from "@/shared/ui/pagination";
import { formatNumber } from "@/shared/utils/formatNumber";
import { getIcon } from "../_utils/getIcon";
import { getBadgeVariant } from "../_utils/getBadgeVariant";
import { getStyle } from "../_utils/getStyle";

export default function IndexingPage() {
  // URL 쿼리 파라미터 관리
  const [page, setPage] = useQueryParam<number>("page", 1);
  const [pageSize, setPageSize] = useQueryParam<number>("pageSize", 20);

  // API 호출
  const {
    data: collectionsData,
    isLoading,
    refetch,
    isFetching,
  } = useGetCollections({
    page,
    page_size: pageSize,
  });

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">지식 관리</h1>
          <p className="mt-1 text-muted-foreground">
            Milvus 컬렉션 목록 조회 및 데이터 관리
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-2 w-fit"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          새로고침
        </Button>
      </div>

      {/* 필터 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            {/* 페이지 크기 */}
            <div className="w-full md:w-40">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Layers className="h-4 w-4" />
                표시 개수
              </label>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger>
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
        </CardContent>
      </Card>

      {/* 컬렉션 테이블 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="h-5 w-5" />
            컬렉션 목록
            {!isLoading && collectionsData && (
              <Badge variant="secondary" className="ml-2">
                {formatNumber(collectionsData.total)}개
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            // 로딩 스켈레톤
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          )}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%] min-w-[250px]">
                      컬렉션 이름
                    </TableHead>
                    <TableHead className="w-[15%] min-w-[100px] text-center">
                      타입
                    </TableHead>
                    <TableHead className="w-[15%] min-w-[100px] text-center">
                      그룹 ID
                    </TableHead>
                    <TableHead className="w-[20%] min-w-[120px] text-right">
                      레코드 수
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collectionsData?.items.map((collection) => (
                    <TableRow
                      key={collection.collection_name}
                      className="group cursor-pointer transition-colors hover:bg-muted/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${getStyle(collection.db_type)}`}
                          >
                            {getIcon(collection.db_type)}
                          </div>
                          <div>
                            <p className="font-medium">
                              {collection.collection_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Milvus Collection
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={getBadgeVariant(collection.db_type)}
                          className="gap-1"
                        >
                          {getIcon(collection.db_type)}
                          {collection.db_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {collection.group_id !== null &&
                        collection.group_id !== undefined ? (
                          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            #{collection.group_id}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-mono text-sm">
                          {formatNumber(collection.row_count)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
        </CardContent>
      </Card>

      {/* 페이지네이션 */}
      {collectionsData && collectionsData.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            전체 {formatNumber(collectionsData.total)}개 중{" "}
            {formatNumber((page - 1) * pageSize + 1)}-
            {formatNumber(Math.min(page * pageSize, collectionsData.total))}
            개 표시
          </p>
          <Pagination
            currentPage={page}
            totalPages={collectionsData.totalPages}
            onPageChange={setPage}
            isLoading={isFetching}
          />
        </div>
      )}
    </div>
  );
}
