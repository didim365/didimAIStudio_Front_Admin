"use client";

import { useState } from "react";
import { useGetGroup } from "../hooks/useGetGroup";
import { useGetUser } from "@/feature/users/hooks/useGetUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Separator } from "@/shared/ui/separator";
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
  Clock,
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
} from "../constants/groupType";
import { getInitials } from "@/feature/users/utils/getInitials";

interface GroupPageProps {
  groupId: string;
}

function GroupPage({ groupId }: GroupPageProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const {
    data: group,
    isLoading,
    error,
  } = useGetGroup({ group_id: Number(groupId) });

  // 매니저 정보 조회 (옵션 B: 추가 API 호출)
  const { data: manager } = useGetUser(
    { user_id: group?.manager ?? 0 },
    { enabled: !!group?.manager }
  );

  // 생성자 정보 조회
  const { data: creator } = useGetUser(
    { user_id: group?.creator ?? 0 },
    { enabled: !!group?.creator }
  );

  // 상위 그룹 정보 조회
  const { data: parentGroup } = useGetGroup(
    { group_id: group?.parent_group_id ?? 0 },
    { enabled: !!group?.parent_group_id }
  );

  const handleDelete = () => {
    // TODO: 그룹 삭제 API 호출
    console.log("그룹 삭제:", groupId);
    setShowDeleteDialog(false);
    // TODO: 삭제 후 그룹 목록 페이지로 이동하거나 리프레시
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 px-4">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">오류 발생</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              그룹 정보를 불러오는 중 오류가 발생했습니다.
            </p>
            <p className="text-sm text-destructive mt-2">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="py-8 px-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              그룹을 찾을 수 없습니다.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <Link href={`/groups/${groupId}/edit`}>
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
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>삭제</AlertDialogAction>
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
                    {parentGroup && (
                      <Link
                        href={`/groups/${parentGroup.id}`}
                        className="text-primary hover:underline cursor-pointer"
                      >
                        {parentGroup.group_name}
                      </Link>
                    )}
                    {!parentGroup && "없음"}
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
                    {manager && (
                      <Link
                        href={`/users/${manager.id}`}
                        className="text-primary hover:underline cursor-pointer"
                      >
                        {manager.full_name || manager.email}
                      </Link>
                    )}
                    {!manager && "미지정"}
                  </p>
                </div>

                {/* Creator */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="font-medium">생성자</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    {creator && (
                      <Link
                        href={`/users/${creator.id}`}
                        className="text-primary hover:underline cursor-pointer"
                      >
                        {creator.full_name || creator.email}
                      </Link>
                    )}
                    {!creator && `#${group.creator}`}
                  </p>
                </div>

                {/* Role ID */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">역할 ID</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    {group.role_id && `#${group.role_id}`}
                    {!group.role_id && "미지정"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              활동 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Created At */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>그룹 생성일</span>
              </div>
              <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                <p className="text-sm font-mono">
                  {formatDate(group.created_at)}
                </p>
              </div>
            </div>

            <Separator />

            {/* Updated At */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>마지막 업데이트</span>
              </div>
              <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                <p className="text-sm font-mono">
                  {group.updated_at && formatDate(group.updated_at)}
                  {!group.updated_at && "없음"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Members Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5" />
              그룹 멤버 ({group.member_count})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {group?.members?.map((member) => (
                <Link
                  key={member.user_id}
                  href={`/users/${member.user_id}`}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="text-sm">
                        {getInitials(member.full_name, `user${member.user_id}`)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {member.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ID: #{member.user_id}
                      </p>
                    </div>
                  </div>
                </Link>
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
      </div>
    </div>
  );
}

export default GroupPage;
