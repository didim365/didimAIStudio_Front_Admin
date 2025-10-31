import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { MoreVertical, Shield, Key, Trash2 } from "lucide-react";
import { paths } from "@/shared/types/api/auth";
import { formatPhoneNumber } from "@/shared/lib/formatPhoneNumber";
import Link from "next/link";

type UserResponse =
  paths["/api/v1/users/admin/users"]["get"]["responses"]["200"]["content"]["application/json"]["items"][number];

interface UsersTableProps {
  users: UserResponse[];
}

export function UsersTable({ users }: UsersTableProps) {
  return (
    <Table className="table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40%] min-w-[200px]">사용자</TableHead>
          <TableHead className="w-[10%] min-w-[80px] text-center">
            상태
          </TableHead>
          <TableHead className="w-[10%] min-w-[100px] text-center">
            전화번호
          </TableHead>
          <TableHead className="w-[10%] min-w-[100px] text-center">
            최근 접속
          </TableHead>
          <TableHead className="w-[10%] min-w-[100px] text-center">
            생성일
          </TableHead>
          <TableHead className="w-[10%] min-w-[100px] text-center">
            수정일
          </TableHead>
          <TableHead className="w-[10%] min-w-[80px] text-right">
            작업
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow
            key={`user-${user.id}`}
            className="group cursor-pointer hover:bg-slate-50"
          >
            <Link
              href={`/dashboard/users/${user.id}`}
              className="contents"
              title={`/dashboard/users/${user.id}`}
            >
              <TableCell className="overflow-hidden">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="shrink-0">
                    {user.profile_image_url && (
                      <AvatarImage
                        src={user.profile_image_url}
                        alt={user.full_name || user.email}
                      />
                    )}
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                      {(
                        user.full_name ||
                        user.email.split("@")[0] ||
                        "U"
                      ).substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">
                      {user.full_name || user.email.split("@")[0] || "-"}
                    </div>
                    <div className="text-sm text-slate-500 truncate">
                      {user.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline">
                  {user.status === "ACTIVE" && "활성"}
                  {user.status === "INACTIVE" && "비활성"}
                  {user.status === "SUSPENDED" && "정지"}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <div className="text-sm">{formatPhoneNumber(user.phone)}</div>
              </TableCell>
              <TableCell className="text-center">
                <div className="text-sm">
                  {user.last_login &&
                    new Date(user.last_login).toLocaleDateString("ko-KR")}
                  {!user.last_login && "-"}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="text-sm">
                  {user.created_at &&
                    new Date(user.created_at).toLocaleDateString("ko-KR")}
                  {!user.created_at && "-"}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="text-sm">
                  {user.updated_at &&
                    new Date(user.updated_at).toLocaleDateString("ko-KR")}
                  {!user.updated_at && "-"}
                </div>
              </TableCell>
            </Link>
            <TableCell
              className="text-right"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Shield className="h-4 w-4 mr-2" />
                    권한 변경
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Key className="h-4 w-4 mr-2" />
                    비밀번호 재설정
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    삭제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
