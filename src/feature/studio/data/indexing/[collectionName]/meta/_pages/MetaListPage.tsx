"use client";

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
import { Button } from "@/shared/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

// 파일 타입 아이콘 색상
const getFileTypeStyle = (fileType: string) => {
  const styleMap: Record<string, string> = {
    pdf: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    docx: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    doc: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    xlsx: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    xls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    pptx: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    ppt: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    txt: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
    csv: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    json: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    md: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  };
  return styleMap[fileType?.toLowerCase()] || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
};

export default function MetaListPage() {
  const params = useParams();
  const collectionName = params.collectionName as string;

  // URL 쿼리 파라미터 관리
  const [page, setPage] = useQueryParam<number>("page", 1);
  const [pageSize, setPageSize] = useQueryParam<number>("pageSize", 20);

  // API 호출
  const {
    data: metaData,
    isLoading,
    isFetching,
  } = useGetMetaCollections(
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
              {!isLoading && metaData && (
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
                    <TableHead className="w-[60px] text-center">ID</TableHead>
                    <TableHead className="min-w-[200px]">제목</TableHead>
                    <TableHead className="w-[100px] text-center">파일 타입</TableHead>
                    <TableHead className="w-[100px] text-center">상태</TableHead>
                    <TableHead className="w-[100px] text-right">파일 크기</TableHead>
                    <TableHead className="w-[80px] text-right">청크</TableHead>
                    <TableHead className="w-[80px] text-right">토큰</TableHead>
                    <TableHead className="w-[100px] text-center">만료일</TableHead>
                    <TableHead className="w-[60px] text-center">다운로드</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // 로딩 스켈레톤
                    Array.from({ length: 5 }).map((_, idx) => (
                      <TableRow key={idx}>
                        {Array.from({ length: 9 }).map((_, cellIdx) => (
                          <TableCell key={cellIdx}>
                            <div className="h-4 animate-pulse rounded bg-muted" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : metaData?.items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-32 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                          <FileText className="h-10 w-10 opacity-40" />
                          <p>데이터가 없습니다</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    metaData?.items.map((item) => {
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
                              className={`gap-1 uppercase ${getFileTypeStyle(item.file_type)}`}
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
                            {item.download_url ? (
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
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 페이지네이션 */}
        {metaData && metaData.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              전체 {formatNumber(metaData.total)}개 중{" "}
              {formatNumber((page - 1) * pageSize + 1)}-
              {formatNumber(Math.min(page * pageSize, metaData.total))}
              개 표시
            </p>
            <Pagination
              currentPage={page}
              totalPages={metaData.totalPages}
              onPageChange={setPage}
              isLoading={isFetching}
            />
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
