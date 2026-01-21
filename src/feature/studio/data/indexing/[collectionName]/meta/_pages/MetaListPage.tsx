"use client";

import { useParams } from "next/navigation";
import { cn } from "@/shared/lib/utils";
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
import {
  FileText,
  Layers,
  Hash,
  Clock,
  FileType,
  HardDrive,
  Sparkles,
  Calendar,
  Download,
} from "lucide-react";
import { useGetMetaCollections } from "../_hooks/useGetMetaCollections";
import { useQueryParam } from "@/shared/hooks/useQueryParams";
import { Pagination } from "@/shared/ui/pagination";
import { formatNumber } from "@/shared/utils/formatNumber";
import { formatBytes } from "@/shared/utils/formatBytes";
import { formatDate } from "@/shared/utils/formatDate";
import { getStatusBadge } from "../_utils/getStatusBadge";
import { getFileTypeStyle } from "../_utils/getFileTypeStyle";
import { Button } from "@/shared/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

export default function MetaListPage() {
  const params = useParams();
  const collectionName = params.collectionName as string;

  // URL 쿼리 파라미터 관리
  const [page, setPage] = useQueryParam<number>("page", 1);
  const [pageSize, setPageSize] = useQueryParam<number>("pageSize", 20);

  // API 호출
  const { data: metaData, isFetching } = useGetMetaCollections(
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

        {/* 메타 데이터 테이블 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              메타 데이터 목록
              {metaData && (
                <Badge variant="secondary" className="ml-2">
                  {formatNumber(metaData.total)}개
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
                    <TableHead>제목</TableHead>
                    <TableHead className="w-[10%] text-center">파일 타입</TableHead>
                    <TableHead className="w-[10%] text-center">상태</TableHead>
                    <TableHead className="w-[10%] text-right">파일 크기</TableHead>
                    <TableHead className="w-[8%] text-right">청크</TableHead>
                    <TableHead className="w-[8%] text-right">토큰</TableHead>
                    <TableHead className="w-[10%] text-center">만료일</TableHead>
                    <TableHead className="w-[6%] text-center">다운로드</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metaData?.items.map((item) => {
                    const statusBadge = getStatusBadge(item.status);
                    return (
                      <TableRow
                        key={item.id}
                        className="group transition-colors hover:bg-muted/50"
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
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <p className="line-clamp-1 font-medium">
                                    {item.title || "-"}
                                  </p>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-sm">
                                  <p>{item.title}</p>
                                  {item.summary && (
                                    <p className="mt-1 text-xs text-muted-foreground line-clamp-3">
                                      {item.summary}
                                    </p>
                                  )}
                                </TooltipContent>
                              </Tooltip>
                              <p className="line-clamp-1 text-xs text-muted-foreground">
                                {item.filename}
                              </p>
                            </div>
                          </TableCell>

                          {/* 파일 타입 */}
                          <TableCell className="text-center">
                            <Badge
                              variant="outline"
                              className={cn("gap-1 uppercase", getFileTypeStyle(item.file_type))}
                            >
                              <FileType className="h-3 w-3" />
                              {item.file_type}
                            </Badge>
                          </TableCell>

                          {/* 상태 */}
                          <TableCell className="text-center">
                            <Badge variant={statusBadge.variant} className="gap-1">
                              {item.status === "completed" && (
                                <Sparkles className="h-3 w-3" />
                              )}
                              {item.status === "processing" && (
                                <Clock className="h-3 w-3 animate-spin" />
                              )}
                              {statusBadge.label}
                            </Badge>
                          </TableCell>

                          {/* 파일 크기 */}
                          <TableCell className="text-right">
                            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                              <HardDrive className="h-3 w-3" />
                              {formatBytes(item.file_size)}
                            </span>
                          </TableCell>

                          {/* 청크 수 */}
                          <TableCell className="text-right">
                            <span className="font-mono text-sm">
                              {formatNumber(item.chunk_count)}
                            </span>
                          </TableCell>

                          {/* 토큰 */}
                          <TableCell className="text-right">
                            <span className="font-mono text-sm">
                              {formatNumber(item.token)}
                            </span>
                          </TableCell>

                          {/* 만료일 */}
                          <TableCell className="text-center">
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {formatDate(item.expiration_date)}
                            </span>
                          </TableCell>

                          {/* 다운로드 */}
                          <TableCell className="text-center">
                            {item.download_url && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(item.download_url, "_blank");
                                    }}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>파일 다운로드</TooltipContent>
                              </Tooltip>
                            )}
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
        {metaData && metaData.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={metaData.totalPages}
              onPageChange={setPage}
              isLoading={isFetching}
            />
        )}
      </div>
    </TooltipProvider>
  );
}
