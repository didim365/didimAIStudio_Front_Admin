"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
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
import { Layers, Hash, FolderOpen, Coins, Calendar } from "lucide-react";
import { useGetVectorData } from "../_hooks/useGetVectorData";
import { useQueryParam } from "@/shared/hooks/useQueryParams";
import { Pagination } from "@/shared/ui/pagination";
import { formatNumber } from "@/shared/utils/formatNumber";
import { formatDate } from "@/shared/utils/formatDate";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import VectorDetailDialog from "../_components/VectorDetailDialog";
import type { components } from "@/shared/types/api/indexing";

type VectorDataItem = components["schemas"]["AdminVectorDataItemDTO"];

export default function VectorListPage() {
  const params = useParams();
  const collectionName = params.collectionName as string;

  // 모달 상태
  const [selectedItem, setSelectedItem] = useState<VectorDataItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleRowClick = (item: VectorDataItem) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  // URL 쿼리 파라미터 관리
  const [page, setPage] = useQueryParam<number>("page", 1);
  const [pageSize, setPageSize] = useQueryParam<number>("pageSize", 50);

  // API 호출
  const { data: vectorData, isFetching } = useGetVectorData(
    { collection_name: collectionName },
    { page, page_size: pageSize }
  );

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* 필터 */}
        <Card className="border-dashed">
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
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
                    <SelectItem value="20">20개</SelectItem>
                    <SelectItem value="50">50개</SelectItem>
                    <SelectItem value="100">100개</SelectItem>
                    <SelectItem value="200">200개</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 벡터 데이터 테이블 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Layers className="h-5 w-5" />
              벡터 데이터 목록
              {vectorData && (
                <Badge variant="secondary" className="ml-2">
                  {formatNumber(vectorData.total)}개
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[5%] text-center">ID</TableHead>
                    <TableHead className="w-[25%]">제목</TableHead>
                    <TableHead className="w-[10%] text-center">
                      카테고리
                    </TableHead>
                    <TableHead className="w-[8%] text-center">페이지</TableHead>
                    <TableHead className="w-[8%] text-center">청크</TableHead>
                    <TableHead className="w-[8%] text-right">토큰</TableHead>
                    <TableHead className="w-[8%] text-right">비용</TableHead>
                    <TableHead className="w-[12%] text-center">날짜</TableHead>
                    <TableHead className="w-[16%]">청크 미리보기</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vectorData?.items.map((item) => (
                    <TableRow
                      key={item.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`${item.title || item.filename} 청크 #${
                        item.chunk_index
                      } 상세 정보 보기`}
                      className="group transition-colors hover:bg-muted/50 hover:cursor-pointer"
                      onClick={() => handleRowClick(item)}
                    >
                      {/* ID */}
                      <TableCell className="text-center">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          <Hash className="mr-1 h-3 w-3" />
                          {item.id}
                        </span>
                      </TableCell>

                      {/* 제목 & 파일명 */}
                      <TableCell>
                        <div className="space-y-1">
                          <p className="line-clamp-1 font-medium">
                            {item.title || "-"}
                          </p>
                          <p className="line-clamp-1 text-xs text-muted-foreground">
                            {item.filename}
                          </p>
                        </div>
                      </TableCell>

                      {/* 카테고리 */}
                      <TableCell className="text-center">
                        <Badge variant="outline" className="gap-1">
                          <FolderOpen className="h-3 w-3" />
                          {item.category || "-"}
                        </Badge>
                      </TableCell>

                      {/* 페이지 */}
                      <TableCell className="text-center">
                        <span className="font-mono text-sm">
                          {item.page_number}
                        </span>
                      </TableCell>

                      {/* 청크 인덱스 */}
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="font-mono">
                          #{item.chunk_index}
                        </Badge>
                      </TableCell>

                      {/* 토큰 */}
                      <TableCell className="text-right">
                        <span className="font-mono text-sm">
                          {formatNumber(item.token)}
                        </span>
                      </TableCell>

                      {/* 비용 */}
                      <TableCell className="text-right">
                        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                          <Coins className="h-3 w-3" />${item.cost.toFixed(4)}
                        </span>
                      </TableCell>

                      {/* 날짜 */}
                      <TableCell className="text-center">
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(item.date)}
                        </span>
                      </TableCell>

                      {/* 청크 미리보기 */}
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="line-clamp-2 text-xs text-muted-foreground cursor-help">
                              {item.parsed_text.slice(0, 100)}
                              {item.parsed_text.length > 100 && "..."}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent
                            side="left"
                            className="max-w-[400px] max-h-[300px] overflow-y-auto"
                          >
                            <p className="text-sm whitespace-pre-wrap">
                              {item.parsed_text.slice(0, 500)}
                              {item.parsed_text.length > 500 && "..."}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 페이지네이션 */}
        {vectorData && vectorData.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={vectorData.totalPages}
            onPageChange={setPage}
            isLoading={isFetching}
          />
        )}

        {/* 벡터 상세 모달 */}
        {selectedItem && (
          <VectorDetailDialog
            item={selectedItem}
            open={isDetailOpen}
            onOpenChange={setIsDetailOpen}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
