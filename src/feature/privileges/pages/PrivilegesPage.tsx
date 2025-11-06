"use client";

import { useGetPrivileges } from "../hooks/useGetPrivileges";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ACTION_TYPE_VARIANTS,
  ACTION_TYPE_LABELS,
} from "@/feature/privileges/constants/actionType";

export default function PrivilegesPage() {
  const router = useRouter();
  const { data: privileges, isLoading, error } = useGetPrivileges();

  const handlePrivilegeClick = (privilegeId: number) => {
    router.push(`/privileges/${privilegeId}`);
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">권한 관리</h1>
        <p className="mt-2">시스템 권한을 관리할 수 있습니다.</p>
      </div>

      {/* 액션 버튼 */}
      <Card className="mb-6">
        <CardContent>
          <Link href="/privileges/add">
            <Button className="gap-2 cursor-pointer">
              <Plus className="h-4 w-4" />
              권한 생성
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* 권한 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            전체 권한 {!isLoading && privileges?.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="w-full">
            <TableHeader>
              <TableRow className="text-center">
                <TableHead className="w-[5%] text-center">ID</TableHead>
                <TableHead className="w-[25%] text-center">권한명</TableHead>
                <TableHead className="w-[35%] text-center">설명</TableHead>
                <TableHead className="w-[20%] text-center">
                  리소스 타입
                </TableHead>
                <TableHead className="w-[15%] text-center">액션 타입</TableHead>
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
                      <Skeleton className="h-4 w-24 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-6 w-16 mx-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              {error && (
                <TableRow className="text-center">
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-muted-foreground"
                  >
                    데이터를 불러오는 중 오류가 발생했습니다.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !error && privileges?.length === 0 && (
                <TableRow className="text-center">
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-muted-foreground"
                  >
                    등록된 권한이 없습니다.
                  </TableCell>
                </TableRow>
              )}
              {privileges?.map((privilege) => (
                <TableRow
                  key={privilege.id}
                  onClick={() => handlePrivilegeClick(privilege.id)}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium text-center">
                    {privilege.id}
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    {privilege.privilege_name}
                  </TableCell>
                  <TableCell className="text-center">
                    {privilege.description || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{privilege.resource_type}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        ACTION_TYPE_VARIANTS[privilege.action_type] || "default"
                      }
                      className="mx-auto"
                    >
                      {ACTION_TYPE_LABELS[privilege.action_type] ||
                        privilege.action_type}
                    </Badge>
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
