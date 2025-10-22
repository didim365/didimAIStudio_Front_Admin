import { User, roleColors, statusColors } from "../types";
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

interface UsersTableProps {
  users: User[];
  isDarkMode: boolean;
  onEditUser: (user: User) => void;
}

export function UsersTable({ users, isDarkMode, onEditUser }: UsersTableProps) {
  const getUsageColor = (used: number, limit: number) => {
    const ratio = used / limit;
    if (ratio > 0.9) return "bg-red-500";
    if (ratio > 0.7) return "bg-orange-500";
    return "bg-blue-500";
  };

  const getUsageColorEmbed = (used: number, limit: number) => {
    const ratio = used / limit;
    if (ratio > 0.9) return "bg-red-500";
    if (ratio > 0.7) return "bg-orange-500";
    return "bg-purple-500";
  };

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
                    {user.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div
                    className="font-medium"
                    style={{ color: isDarkMode ? "#ffffff" : undefined }}
                  >
                    {user.name}
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: isDarkMode ? "#cccccc" : undefined }}
                  >
                    {user.email}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div
                className="text-sm"
                style={{ color: isDarkMode ? "#cccccc" : undefined }}
              >
                {user.group}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className={roleColors[user.role]}>
                {user.role}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className={statusColors[user.status]}>
                {user.status === "active" ? "활성" : "비활성"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <div
                  className="text-sm font-medium"
                  style={{ color: isDarkMode ? "#ffffff" : undefined }}
                >
                  {user.chatUsed.toLocaleString()} /{" "}
                  {user.chatLimit.toLocaleString()}
                </div>
                <div
                  className="w-full rounded-full h-1.5"
                  style={{ backgroundColor: isDarkMode ? "#333333" : undefined }}
                >
                  <div
                    className={`h-1.5 rounded-full ${getUsageColor(
                      user.chatUsed,
                      user.chatLimit
                    )}`}
                    style={{
                      width: `${(user.chatUsed / user.chatLimit) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <div
                  className="text-sm font-medium"
                  style={{ color: isDarkMode ? "#ffffff" : undefined }}
                >
                  {user.embeddingUsed.toLocaleString()} /{" "}
                  {user.embeddingLimit.toLocaleString()}
                </div>
                <div
                  className="w-full rounded-full h-1.5"
                  style={{ backgroundColor: isDarkMode ? "#333333" : undefined }}
                >
                  <div
                    className={`h-1.5 rounded-full ${getUsageColorEmbed(
                      user.embeddingUsed,
                      user.embeddingLimit
                    )}`}
                    style={{
                      width: `${(user.embeddingUsed / user.embeddingLimit) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div
                className="text-sm"
                style={{ color: isDarkMode ? "#cccccc" : undefined }}
              >
                {user.lastLogin}
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
