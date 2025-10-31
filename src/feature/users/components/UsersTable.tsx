import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { MoreVertical, Edit, Shield, Key, Trash2 } from "lucide-react";
import { paths } from "@/shared/types/api/auth";

type UserResponse =
  paths["/api/v1/users/admin/users"]["get"]["responses"]["200"]["content"]["application/json"]["items"][number];

interface UsersTableProps {
  users: UserResponse[];
  onEditUser: (user: UserResponse) => void;
}

export function UsersTable({ users, onEditUser }: UsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>사용자</TableHead>
          <TableHead>그룹</TableHead>
          <TableHead>권한</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>챗 사용량</TableHead>
          <TableHead>임베딩 사용량</TableHead>
          <TableHead>최근 접속</TableHead>
          <TableHead className="text-right">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                    {(
                      user.full_name ||
                      user.email.split("@")[0] ||
                      "U"
                    ).substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {user.full_name || user.email.split("@")[0] || "-"}
                  </div>
                  <div className="text-sm">{user.email}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">-</div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">-</Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                {user.status === "ACTIVE"
                  ? "활성"
                  : user.status === "INACTIVE"
                  ? "비활성"
                  : user.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <div className="text-sm font-medium">-</div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <div className="text-sm font-medium">-</div>
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {user.last_login
                  ? new Date(user.last_login).toLocaleDateString("ko-KR")
                  : "-"}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEditUser(user)}>
                    <Edit className="h-4 w-4 mr-2" />
                    수정
                  </DropdownMenuItem>
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
