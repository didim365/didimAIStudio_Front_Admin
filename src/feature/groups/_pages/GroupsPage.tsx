"use client";

import { useGetGroups } from "../_hooks/useGetGroups";
import { useQueryParam } from "@/shared/hooks/useQueryParams";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Plus, Search, Filter, ArrowUpDown } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { formatDate } from "@/shared/utils/formatDate";
import { Pagination } from "@/shared/ui/pagination";
import Link from "next/link";
import {
  getGroupTypeLabel,
  GROUP_TYPE_BADGE_VARIANTS,
} from "../_constants/groupType";
import { useRouter } from "next/navigation";
import { GroupTypeEnum } from "../_types/groupType";
import { isValidGroupType } from "../_utils/isValidGroupType";

export function GroupsPage() {
  const [page, setPage] = useQueryParam<number>("page", 1);
  const [q, setQ] = useQueryParam<string>("q", "");
  const [groupType, setGroupType] = useQueryParam<GroupTypeEnum>(
    "group_type",
    ""
  );
  const [pageSize, setPageSize] = useQueryParam<number>("page_size", 20);
  const [sortBy, setSortBy] = useQueryParam<string>("sort_by", "created_at");
  const [sortOrder, setSortOrder] = useQueryParam<string>("sort_order", "desc");

  const router = useRouter();
  const { data } = useGetGroups({
    page,
    q: q || undefined,
    group_type: groupType || undefined,
    page_size: pageSize,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  const handleGroupClick = (groupId: number) => {
    router.push(`/groups/${groupId}`);
  };

  const handleGroupTypeChange = (value: string) => {
    if (isValidGroupType(value)) {
      setGroupType(value);
      setPage(1);
    }
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">그룹 관리</h1>
        <p className="mt-2">시스템 내 모든 그룹을 관리할 수 있습니다.</p>
      </div>

      {/* 검색 및 필터 */}
      <Card className="mb-6">
        <CardContent className="px-6 space-y-4">
          {/* 검색바 */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="그룹명 또는 설명으로 검색..."
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
            <Link href="/groups/add">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                그룹 생성
              </Button>
            </Link>
          </div>

          {/* 필터 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 그룹 타입 필터 */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Filter className="h-4 w-4" />
                그룹 타입
              </label>
              <Select value={groupType} onValueChange={handleGroupTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">전체</SelectItem>
                  <SelectItem value="COMPANY">회사</SelectItem>
                  <SelectItem value="DEPARTMENT">부서</SelectItem>
                  <SelectItem value="TEAM">팀</SelectItem>
                  <SelectItem value="PERSONAL">개인</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 표시 개수 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">표시 개수</label>
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

            {/* 정렬 기준 */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                정렬 기준
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">생성일</SelectItem>
                  <SelectItem value="group_name">그룹명</SelectItem>
                  <SelectItem value="group_type">그룹 타입</SelectItem>
                  <SelectItem value="member_count">회원 수</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 정렬 순서 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">정렬 순서</label>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">내림차순</SelectItem>
                  <SelectItem value="asc">오름차순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 그룹 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            전체 그룹 {data?.total}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="w-full">
            <TableHeader>
              <TableRow className="text-center">
                <TableHead className="w-[5%] text-center">ID</TableHead>
                <TableHead className="w-[25%] text-center">그룹명</TableHead>
                <TableHead className="w-[20%] text-center">설명</TableHead>
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
              {data?.items?.map((group) => (
                <TableRow
                  key={group.id}
                  onClick={() => handleGroupClick(group.id)}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium text-center">
                    {group.id}
                  </TableCell>
                  <TableCell className="font-medium">
                    {group.group_name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {group.description ?? "-"}
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
                    {group.role_id && `#${group.role_id}`}
                    {!group.role_id && "-"}
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
          />
        </div>
      )}
    </div>
  );
}
