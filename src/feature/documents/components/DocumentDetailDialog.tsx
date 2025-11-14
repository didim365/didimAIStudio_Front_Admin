"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { Document } from "../types";
import {
  FileText,
  User,
  Users,
  Calendar,
  HardDrive,
  Zap,
  Lock,
  Globe,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
} from "lucide-react";

interface DocumentDetailDialogProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DocumentDetailDialog({
  document,
  open,
  onOpenChange,
}: DocumentDetailDialogProps) {
  if (!document) return null;

  const getEmbeddingStatusIcon = (status: Document["embeddingStatus"]) => {
    const icons = {
      completed: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      processing: <Clock className="h-5 w-5 text-yellow-500" />,
      pending: <AlertCircle className="h-5 w-5 text-gray-500" />,
      failed: <XCircle className="h-5 w-5 text-red-500" />,
    };
    return icons[status];
  };

  const getEmbeddingStatusText = (status: Document["embeddingStatus"]) => {
    const texts = {
      completed: "임베딩 완료",
      processing: "처리 중",
      pending: "대기 중",
      failed: "실패",
    };
    return texts[status];
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "-";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {document.title}
          </DialogTitle>
          <DialogDescription>
            문서의 상세 정보 및 역할 설정을 확인할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">기본 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem
                icon={<User className="h-4 w-4" />}
                label="작성자"
                value={document.authorName}
              />
              <InfoItem
                icon={<Users className="h-4 w-4" />}
                label="소속 그룹"
                value={<Badge variant="secondary">{document.groupName}</Badge>}
              />
              <InfoItem
                icon={<Calendar className="h-4 w-4" />}
                label="생성일"
                value={formatDate(document.createdAt)}
              />
              <InfoItem
                icon={<Calendar className="h-4 w-4" />}
                label="수정일"
                value={formatDate(document.updatedAt)}
              />
              <InfoItem
                icon={<HardDrive className="h-4 w-4" />}
                label="파일 크기"
                value={formatFileSize(document.fileSize)}
              />
              <InfoItem
                icon={<FileText className="h-4 w-4" />}
                label="파일 타입"
                value={document.fileType?.toUpperCase() || "-"}
              />
            </div>

            {document.tags && document.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {document.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* 임베딩 상태 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">임베딩 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem
                icon={getEmbeddingStatusIcon(document.embeddingStatus)}
                label="상태"
                value={getEmbeddingStatusText(document.embeddingStatus)}
              />
              <InfoItem
                icon={<Zap className="h-4 w-4" />}
                label="토큰 사용량"
                value={
                  document.tokenUsage > 0
                    ? `${document.tokenUsage.toLocaleString()} 토큰`
                    : "-"
                }
              />
            </div>
            {document.embeddingStatus === "completed" && (
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-200">
                  ✓ 이 문서는 검색 및 추천 기능에 활용할 수 있습니다.
                </p>
              </div>
            )}
            {document.embeddingStatus === "failed" && (
              <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-800 dark:text-red-200">
                  ✗ 임베딩 처리 중 오류가 발생했습니다. 다시 시도해주세요.
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* 역할 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">접근 역할</h3>

            <div className="flex items-center gap-2 p-4 border rounded-lg">
              {document.permissions.isPublic ? (
                <>
                  <Globe className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">전체 공개</div>
                    <div className="text-sm text-muted-foreground">
                      모든 사용자가 이 문서에 접근할 수 있습니다.
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5 text-orange-500" />
                  <div>
                    <div className="font-medium">접근 제한</div>
                    <div className="text-sm text-muted-foreground">
                      특정 그룹 및 사용자만 접근할 수 있습니다.
                    </div>
                  </div>
                </>
              )}
            </div>

            {!document.permissions.isPublic && (
              <>
                {/* 그룹 역할 */}
                {document.permissions.allowedGroups.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">허용된 그룹</div>
                    <div className="space-y-2">
                      {document.permissions.allowedGroups.map((group) => (
                        <div
                          key={group.groupId}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <span>{group.groupName}</span>
                          <Badge
                            variant={
                              group.level === "admin"
                                ? "destructive"
                                : group.level === "write"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {group.level === "admin"
                              ? "관리"
                              : group.level === "write"
                              ? "쓰기"
                              : "읽기"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 사용자 역할 */}
                {document.permissions.allowedUsers.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">허용된 사용자</div>
                    <div className="space-y-2">
                      {document.permissions.allowedUsers.map((user) => (
                        <div
                          key={user.userId}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <span>{user.userName}</span>
                          <Badge
                            variant={
                              user.level === "admin"
                                ? "destructive"
                                : user.level === "write"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {user.level === "admin"
                              ? "관리"
                              : user.level === "write"
                              ? "쓰기"
                              : "읽기"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="flex-1">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}
