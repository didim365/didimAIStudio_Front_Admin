"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteGroup } from "../_hooks/useDeleteGroup";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import {
  Building2,
  Users as UsersIcon,
  Calendar,
  ArrowLeft,
  Pencil,
  Trash2,
  User,
  UserCircle,
  Hash,
  FolderTree,
  Shield,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { formatDate } from "@/shared/utils/formatDate";
import {
  getGroupTypeLabel,
  GROUP_TYPE_ICONS,
  GROUP_TYPE_COLORS,
} from "../../_constants/groupType";
import { getInitials } from "@/feature/users/utils/getInitials";
import AddMemberDialog from "../_components/AddMemberDialog";
import GroupRolesCard from "../_components/GroupRolesCard";

import type { GetGroupResponse } from "../_api/getGroup";

interface GroupPageProps {
  group: GetGroupResponse;
}

function GroupPage({ group }: GroupPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // 그룹 삭제 mutation
  const { mutate: deleteGroup, isPending: isDeleting } = useDeleteGroup({
    onSuccess: () => {
      // 그룹 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
      router.push("/groups");
    },
  });

  const handleDelete = () => {
    deleteGroup({ group_id: group.id });
  };

  const GroupTypeIcon = GROUP_TYPE_ICONS[group.group_type] || Building2;
  const groupTypeColor =
    GROUP_TYPE_COLORS[group.group_type] ||
    "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/groups">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              그룹 상세 정보
            </h1>
            <p className="text-muted-foreground">그룹 ID: {group.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/groups/${group.id}/edit`}>
            <Button className="cursor-pointer">
              <Pencil className="h-4 w-4 mr-2" />
              수정
            </Button>
          </Link>
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            제거
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={(open) => {
          if (!isDeleting) {
            setShowDeleteDialog(open);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>그룹 삭제 확인</AlertDialogTitle>
            <AlertDialogDescription>
              정말 <span className="font-semibold">{group.group_name}</span>
              을(를) 삭제하시겠습니까?
              <br />
              <span className="text-destructive mt-2 block">
                이 작업은 되돌릴 수 없습니다. 하위 그룹이나 멤버가 있으면 삭제할
                수 없습니다.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "삭제 중..." : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              그룹 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Icon */}
              <div className="flex flex-col items-center gap-4">
                <div className="h-32 w-32 border-4 border-background shadow-lg rounded-2xl from-primary/20 to-primary/5 flex items-center justify-center">
                  <GroupTypeIcon className="h-16 w-16 text-primary" />
                </div>
                <Badge className={`${groupTypeColor} border`}>
                  {getGroupTypeLabel(group.group_type)}
                </Badge>
              </div>

              {/* Group Info Grid */}
              <div className="flex-1 grid gap-4 md:grid-cols-2">
                {/* Group Name */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">그룹명</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    {group.group_name}
                  </p>
                </div>

                {/* Group ID */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    <span className="font-medium">그룹 ID</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">#{group.id}</p>
                </div>

                {/* Parent Group */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FolderTree className="h-4 w-4" />
                    <span className="font-medium">상위 그룹</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    <Link
                      href={`/groups/${group.parent_group_id}`}
                      className="text-primary hover:underline cursor-pointer"
                    >
                      {group.id}
                    </Link>
                  </p>
                </div>

                {/* Member Count */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UsersIcon className="h-4 w-4" />
                    <span className="font-medium">멤버 수</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    {group.member_count}명
                  </p>
                </div>

                {/* Manager */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UserCircle className="h-4 w-4" />
                    <span className="font-medium">매니저</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    <Link
                      href={`/users/${group.manager}`}
                      className="text-primary hover:underline cursor-pointer"
                    >
                      {group.manager}
                    </Link>
                  </p>
                </div>

                {/* Creator */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="font-medium">생성자</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    <Link
                      href={`/users/${group.creator}`}
                      className="text-primary hover:underline cursor-pointer"
                    >
                      {group.creator}
                    </Link>
                  </p>
                </div>

                {/* Role ID */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">역할</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">{group.role_id}</p>
                </div>

                {/* Created At */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">그룹 생성일</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    {formatDate(group.created_at)}
                  </p>
                </div>

                {/* Updated At */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">마지막 업데이트</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    {group.updated_at ? formatDate(group.updated_at) : "없음"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Members Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5" />
                그룹 멤버 ({group.member_count})
              </CardTitle>
              <AddMemberDialog group={group} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {group?.members?.map((member) => (
                <div
                  key={`group-${group.id}, member-${member.user_id}`}
                  className="relative flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                >
                  <Link
                    href={`/users/${member.user_id}`}
                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  >
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="text-sm">
                        {getInitials(member.full_name, `user${member.user_id}`)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {member.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </Link>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        setMemberToDelete({
                          id: member.user_id,
                          name: member.full_name,
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {!group?.members?.length && (
              <div className="text-center py-8">
                <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">
                  아직 멤버가 없습니다
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Group Roles Card */}
        <GroupRolesCard groupId={group.id} />
      </div>

      {/* 멤버 제거 확인 다이얼로그 */}
      <AlertDialog
        open={!!memberToDelete}
        onOpenChange={(open) => {
          if (!open) setMemberToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              그룹 멤버 제거 확인
            </AlertDialogTitle>
            <AlertDialogDescription>
              정말로 <strong>{memberToDelete?.name}</strong> 사용자를 이
              그룹에서 제거하시겠습니까?
              <br />
              <span className="text-xs text-muted-foreground mt-2 block">
                이 작업은 되돌릴 수 없습니다.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                // TODO: API 구현 후 삭제 로직 추가
                // deleteMemberMutation.mutate({
                //   group_id: Number(groupId),
                //   user_id: memberToDelete.id,
                // });
                setMemberToDelete(null);
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              제거
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default GroupPage;
