"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Database, Layers, Trash2, Loader2 } from "lucide-react";
import { useGetCollections } from "../_hooks/useGetCollections";
import { useDeleteCollection } from "../_hooks/useDeleteCollection";
import { useQueryParam } from "@/shared/hooks/useQueryParams";
import { Pagination } from "@/shared/ui/pagination";
import { formatNumber } from "@/shared/utils/formatNumber";
import { getIcon } from "../_components/getIcon";
import { getBadgeVariant } from "../_utils/getBadgeVariant";
import { getStyle } from "../_utils/getStyle";

export default function IndexingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 삭제 모달 상태
  const [deleteTarget, setDeleteTarget] = useState<{
    collection_name: string;
    row_count: number;
  } | null>(null);

  // URL 쿼리 파라미터 관리
  const [page, setPage] = useQueryParam<number>("page", 1);
  const [pageSize, setPageSize] = useQueryParam<number>("pageSize", 20);

  // API 호출
  const {
    data: collectionsData,
    isLoading,
    isFetching,
  } = useGetCollections({
    page,
    page_size: pageSize,
  });

  // 삭제 mutation
  const { mutate: deleteCollection, isPending: isDeleting } = useDeleteCollection({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      setDeleteTarget(null);
    },
  });

  // 삭제 핸들러
  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteCollection({
      collection_name: deleteTarget.collection_name,
      filter_expr: "",
      preview: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">지식 관리</h1>
        <p className="mt-1 text-muted-foreground">
          Milvus 컬렉션 목록 조회 및 데이터 관리
        </p>
      </div>

      {/* 필터 */}
      <Card>
        <CardContent>
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
                  <TableHead className="w-[15%] min-w-[120px] text-right">
                    레코드 수
                  </TableHead>
                  <TableHead className="w-[5%] min-w-[60px] text-center">
                    삭제
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collectionsData?.items.map((collection) => (
                  <TableRow
                    key={collection.collection_name}
                    className="group cursor-pointer transition-colors hover:bg-muted/50"
                    onClick={() => {
                      router.push(
                        `/studio/data/indexing/${encodeURIComponent(collection.collection_name)}`
                      );
                    }}
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
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        #{collection.group_id ?? "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-mono text-sm">
                        {formatNumber(collection.row_count)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget({
                            collection_name: collection.collection_name,
                            row_count: collection.row_count,
                          });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

      {/* 삭제 확인 모달 */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>컬렉션 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-semibold text-foreground">
                {deleteTarget?.collection_name}
              </span>{" "}
              컬렉션의 모든 데이터({formatNumber(deleteTarget?.row_count ?? 0)}
              개)를 삭제하시겠습니까?
              <br />
              <span className="text-destructive">
                이 작업은 되돌릴 수 없습니다.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  삭제 중...
                </>
              ) : (
                "삭제"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
