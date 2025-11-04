"use client";

import { useGetGroups } from "../hooks/useGetGroups";
import { useQueryParam } from "@/shared/hooks/useQueryParams";
import { Button } from "@/shared/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Plus } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
import { formatDate } from "@/shared/utils/formatDate";
import { Pagination } from "@/shared/ui/pagination";
import Link from "next/link";
import {
  getGroupTypeLabel,
  GROUP_TYPE_BADGE_VARIANTS,
} from "../constants/groupType";

export function GroupsPage() {
  const [page, setPage] = useQueryParam<number>("page", 1);

  const { data, isLoading, error } = useGetGroups({
    page,
    include_members: true,
    size: 20,
  });

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">그룹 관리</h1>
        <p className="mt-2">시스템 내 모든 그룹을 관리할 수 있습니다.</p>
      </div>

      {/* 검색 및 필터 */}
      <Card className="mb-6">
        <CardContent>
          <Link href="/groups/add">
            <Button className="gap-2 cursor-pointer">
              <Plus className="h-4 w-4" />
              그룹 생성
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* 그룹 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            전체 그룹 {!isLoading && data?.total}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="w-full">
            <TableHeader>
              <TableRow className="text-center">
                <TableHead className="w-[5%] text-center">ID</TableHead>
                <TableHead className="w-[45%] text-center">그룹명</TableHead>
                <TableHead className="w-[5%] text-center">그룹 타입</TableHead>
                <TableHead className="w-[5%] text-center">상위 그룹</TableHead>
                <TableHead className="w-[5%] text-center">관리자</TableHead>
                <TableHead className="w-[5%] text-center">생성자</TableHead>
                <TableHead className="w-[5%] text-center">역할</TableHead>
                <TableHead className="w-[5%] text-center">회원 수</TableHead>
                <TableHead className="w-[10%] text-center">생성일</TableHead>
                <TableHead className="w-[10%] text-center">수정일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                // 로딩 스켈레톤
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="text-center">
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-12 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-32 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-6 w-16 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-12 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-12 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-12 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-12 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-16 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-32 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-32 mx-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              {error && (
                <TableRow className="text-center">
                  <TableCell
                    colSpan={10}
                    className="h-32 text-center text-muted-foreground"
                  >
                    데이터를 불러오는 중 오류가 발생했습니다.
                  </TableCell>
                </TableRow>
              )}
              {data?.items.map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="font-medium text-center">
                    {group.id}
                  </TableCell>
                  <TableCell className="font-medium">
                    {group.group_name}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={GROUP_TYPE_BADGE_VARIANTS[group.group_type]}
                      className="mx-auto"
                    >
                      {getGroupTypeLabel(group.group_type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {group.parent_group_id ?? "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {group.manager ?? "-"}
                  </TableCell>
                  <TableCell className="text-center">{group.creator}</TableCell>
                  <TableCell className="text-center">
                    {group.role_id ?? "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="mx-auto">
                      {group.member_count}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground text-center">
                    {formatDate(group.created_at)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground text-center">
                    {formatDate(group.updated_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 페이지네이션 */}
      {data && data.total_pages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={data.page}
            totalPages={data.total_pages}
            onPageChange={(newPage) => setPage(newPage)}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}
