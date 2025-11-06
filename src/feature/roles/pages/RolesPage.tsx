"use client";

import { useGetRoles } from "@/feature/roles/hooks/useGetRoles";
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
import { Skeleton } from "@/shared/ui/skeleton";
import { formatDate } from "@/shared/utils/formatDate";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RolesPage() {
  const router = useRouter();
  const { data: roles, isLoading, error } = useGetRoles();

  const handleRoleClick = (roleId: number) => {
    router.push(`/roles/${roleId}`);
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">역할 관리</h1>
        <p className="mt-2">시스템 역할 및 역할을 관리할 수 있습니다.</p>
      </div>

      {/* 검색 및 필터 */}
      <Card className="mb-6">
        <CardContent>
          <Link href="/roles/add">
            <Button className="gap-2 cursor-pointer">
              <Plus className="h-4 w-4" />
              역할 생성
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* 역할 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            전체 역할 {!isLoading && roles?.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="w-full">
            <TableHeader>
              <TableRow className="text-center">
                <TableHead className="w-[5%] text-center">ID</TableHead>
                <TableHead className="w-[30%] text-center">역할명</TableHead>
                <TableHead className="w-[45%] text-center">설명</TableHead>
                <TableHead className="w-[20%] text-center">생성일</TableHead>
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
                      <Skeleton className="h-4 w-full max-w-md mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-32 mx-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              {error && (
                <TableRow className="text-center">
                  <TableCell
                    colSpan={4}
                    className="h-32 text-center text-muted-foreground"
                  >
                    데이터를 불러오는 중 오류가 발생했습니다.
                  </TableCell>
                </TableRow>
              )}
              {roles?.map((role) => (
                <TableRow
                  key={role.id}
                  onClick={() => handleRoleClick(role.id)}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium text-center">
                    {role.id}
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    {role.role_name}
                  </TableCell>
                  <TableCell className="text-center">
                    {role.description || "-"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground text-center">
                    {formatDate(role.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
