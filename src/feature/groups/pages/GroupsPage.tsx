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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";

const GROUP_TYPE_LABELS: Record<string, string> = {
  COMPANY: "회사",
  DEPARTMENT: "부서",
  TEAM: "팀",
  PERSONAL: "개인",
};

const GROUP_TYPE_COLORS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  COMPANY: "default",
  DEPARTMENT: "secondary",
  TEAM: "outline",
  PERSONAL: "destructive",
};

export function GroupsPage() {
  const [page, setPage] = useQueryParam<number>("page", 1);
  const [size, setSize] = useQueryParam<number>("size", 20);

  const { data, isLoading, error } = useGetGroups({
    page,
    size,
    include_members: true,
  });

  const handleCreateGroup = () => {
    // TODO: 그룹 생성 모달 또는 페이지로 이동
    console.log("그룹 생성");
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">그룹 관리</CardTitle>
              <CardDescription>
                시스템 내 모든 그룹을 관리할 수 있습니다.
              </CardDescription>
            </div>
            <Button onClick={handleCreateGroup} className="gap-2">
              <Plus className="h-4 w-4" />
              그룹 생성
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 페이지 크기 선택 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  페이지 크기:
                </span>
                <Select
                  value={size.toString()}
                  onValueChange={(value) => {
                    setSize(Number(value));
                    setPage(1); // 페이지 크기 변경 시 첫 페이지로
                  }}
                >
                  <SelectTrigger className="w-[100px]">
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
              {data && (
                <div className="text-sm text-muted-foreground">
                  전체 {data.total}개 중 {data.items.length}개 표시
                </div>
              )}
            </div>

            {/* 테이블 */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>그룹명</TableHead>
                    <TableHead className="w-[120px]">그룹 타입</TableHead>
                    <TableHead className="w-[100px]">상위 그룹</TableHead>
                    <TableHead className="w-[100px]">관리자</TableHead>
                    <TableHead className="w-[100px]">생성자</TableHead>
                    <TableHead className="w-[100px]">역할</TableHead>
                    <TableHead className="w-[100px]">회원 수</TableHead>
                    <TableHead className="w-[180px]">생성일</TableHead>
                    <TableHead className="w-[180px]">수정일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // 로딩 스켈레톤
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-4 w-12" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-12" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-12" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-12" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-12" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : error ? (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="h-32 text-center text-muted-foreground"
                      >
                        데이터를 불러오는 중 오류가 발생했습니다.
                      </TableCell>
                    </TableRow>
                  ) : data?.items.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="h-32 text-center text-muted-foreground"
                      >
                        등록된 그룹이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.items.map((group) => (
                      <TableRow key={group.id}>
                        <TableCell className="font-medium">
                          {group.id}
                        </TableCell>
                        <TableCell className="font-medium">
                          {group.group_name}
                        </TableCell>
                        <TableCell>
                          <Badge variant={GROUP_TYPE_COLORS[group.group_type]}>
                            {GROUP_TYPE_LABELS[group.group_type] ||
                              group.group_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {group.parent_group_id ?? "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          {group.manager ?? "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          {group.creator}
                        </TableCell>
                        <TableCell className="text-center">
                          {group.role_id ?? "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{group.member_count}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(group.created_at)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(group.updated_at)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* 페이지네이션 */}
            {data && data.total_pages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  페이지 {data.page} / {data.total_pages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    이전
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= data.total_pages}
                  >
                    다음
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
