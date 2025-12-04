import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";
import { formatPhoneNumber } from "@/feature/users/_utils/formatPhoneNumber";
import { GetUsersResponse } from "../_hooks/useGetUsers";
import { getInitials } from "../_utils/getInitials";
import { formatUserStatus } from "../_utils/formatUserStatus";
import { useRouter } from "next/navigation";

export function UsersTable({ users }: { users: GetUsersResponse["items"] }) {
  const router = useRouter();
  return (
    <Table className="table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[5%] min-w-[50px] text-center">ID</TableHead>
          <TableHead className="w-[40%] min-w-[200px] text-center">
            사용자
          </TableHead>
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow
            key={`user-${user.id}`}
            className="group cursor-pointer hover:bg-slate-50"
            onClick={() => router.push(`/users/${user.id}`)}
          >
            <TableCell className="text-center">{user.id}</TableCell>
            <TableCell className="overflow-hidden">
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0 flex-1 flex gap-2">
                  <div className="font-medium truncate">
                    {user.full_name || getInitials(user.full_name, user.email)}
                  </div>
                  <div className="text-sm text-slate-500 truncate">
                    ({user.email})
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-center">
              <Badge variant="outline">
                {formatUserStatus(user.status)}
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

