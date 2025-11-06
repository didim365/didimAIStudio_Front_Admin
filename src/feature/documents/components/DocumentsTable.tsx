"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Document } from "../types";
import { FileText, Lock, Globe, Edit, Trash2 } from "lucide-react";

interface DocumentsTableProps {
  documents: Document[];
  onEdit: (document: Document) => void;
  onDelete: (documentId: string) => void;
  onViewDetails: (document: Document) => void;
}

export function DocumentsTable({
  documents,
  onEdit,
  onDelete,
  onViewDetails,
}: DocumentsTableProps) {
  const getEmbeddingStatusColor = (status: Document["embeddingStatus"]) => {
    const colors = {
      completed: "bg-green-500",
      processing: "bg-yellow-500",
      pending: "bg-gray-500",
      failed: "bg-red-500",
    };
    return colors[status];
  };

  const getEmbeddingStatusText = (status: Document["embeddingStatus"]) => {
    const texts = {
      completed: "완료",
      processing: "처리중",
      pending: "대기",
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
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">문서명</TableHead>
            <TableHead>작성자</TableHead>
            <TableHead>그룹</TableHead>
            <TableHead>임베딩 상태</TableHead>
            <TableHead>토큰 사용</TableHead>
            <TableHead>역할</TableHead>
            <TableHead>파일 크기</TableHead>
            <TableHead>생성일</TableHead>
            <TableHead className="text-right">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center py-8 text-muted-foreground"
              >
                문서가 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            documents.map((document) => (
              <TableRow
                key={document.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onViewDetails(document)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{document.title}</span>
                  </div>
                </TableCell>
                <TableCell>{document.authorName}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{document.groupName}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${getEmbeddingStatusColor(
                        document.embeddingStatus
                      )}`}
                    />
                    <span className="text-sm">
                      {getEmbeddingStatusText(document.embeddingStatus)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {document.tokenUsage > 0
                    ? document.tokenUsage.toLocaleString()
                    : "-"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {document.permissions.isPublic ? (
                      <>
                        <Globe className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">공개</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-orange-600">제한</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatFileSize(document.fileSize)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(document.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div
                    className="flex justify-end gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(document)}
                      title="역할 수정"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(document.id)}
                      title="삭제"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
