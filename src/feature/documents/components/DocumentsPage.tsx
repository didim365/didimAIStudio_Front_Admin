"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { DocumentsTable } from "./DocumentsTable";
import { PermissionEditDialog } from "./PermissionEditDialog";
import { DocumentDetailDialog } from "./DocumentDetailDialog";
import { useDocuments } from "../hooks/useDocuments";
import { Document } from "../types";
import {
  Search,
  Filter,
  FileText,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { mockGroups } from "../utils/mockData";

export default function DocumentsPage() {
  const {
    documents,
    isLoading,
    fetchDocuments,
    updateDocumentPermissions,
    deleteDocument,
  } = useDocuments();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [detailDocument, setDetailDocument] = useState<Document | null>(null);

  const handleSearch = () => {
    fetchDocuments({
      search: searchQuery,
      groupId: selectedGroup !== "all" ? selectedGroup : undefined,
      embeddingStatus:
        selectedStatus !== "all"
          ? (selectedStatus as
              | "pending"
              | "processing"
              | "completed"
              | "failed")
          : undefined,
    });
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedGroup("all");
    setSelectedStatus("all");
    fetchDocuments({});
  };

  const handleDelete = (documentId: string) => {
    if (confirm("정말 이 문서를 삭제하시겠습니까?")) {
      deleteDocument(documentId);
    }
  };

  // 통계 계산
  const stats = {
    total: documents.length,
    embedded: documents.filter((d) => d.embeddingStatus === "completed").length,
    restricted: documents.filter((d) => !d.permissions.isPublic).length,
    tokenUsage: documents.reduce((sum, d) => sum + d.tokenUsage, 0),
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold">문서 관리</h1>
        <p className="text-muted-foreground mt-2">
          문서 상태, 역할, 임베딩 정보를 관리합니다.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 문서</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">총 문서 수</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">임베딩 완료</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.embedded}</div>
            <p className="text-xs text-muted-foreground">
              검색/추천 가능 (
              {((stats.embedded / stats.total) * 100).toFixed(0)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">접근 제한</CardTitle>
            <Lock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.restricted}</div>
            <p className="text-xs text-muted-foreground">
              역할 설정 문서 (
              {((stats.restricted / stats.total) * 100).toFixed(0)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">토큰 사용</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.tokenUsage / 1000).toFixed(1)}K
            </div>
            <p className="text-xs text-muted-foreground">
              총 {stats.tokenUsage.toLocaleString()} 토큰
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 필터 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            검색 및 필터
          </CardTitle>
          <CardDescription>
            문서를 검색하고 필터링할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="문서명으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="그룹 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 그룹</SelectItem>
                {mockGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="임베딩 상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="completed">완료</SelectItem>
                <SelectItem value="processing">처리중</SelectItem>
                <SelectItem value="pending">대기</SelectItem>
                <SelectItem value="failed">실패</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button onClick={handleSearch} disabled={isLoading}>
                검색
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                disabled={isLoading}
              >
                초기화
              </Button>
            </div>
          </div>

          {/* 활성 필터 표시 */}
          {(searchQuery ||
            selectedGroup !== "all" ||
            selectedStatus !== "all") && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchQuery && (
                <Badge variant="secondary">검색: {searchQuery}</Badge>
              )}
              {selectedGroup !== "all" && (
                <Badge variant="secondary">
                  그룹: {mockGroups.find((g) => g.id === selectedGroup)?.name}
                </Badge>
              )}
              {selectedStatus !== "all" && (
                <Badge variant="secondary">
                  상태:{" "}
                  {selectedStatus === "completed"
                    ? "완료"
                    : selectedStatus === "processing"
                    ? "처리중"
                    : selectedStatus === "pending"
                    ? "대기"
                    : "실패"}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 문서 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>문서 목록</CardTitle>
          <CardDescription>
            {documents.length}개의 문서가 표시되고 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentsTable
            documents={documents}
            onEdit={setEditingDocument}
            onDelete={handleDelete}
            onViewDetails={setDetailDocument}
          />
        </CardContent>
      </Card>

      {/* 역할 수정 다이얼로그 */}
      <PermissionEditDialog
        document={editingDocument}
        open={!!editingDocument}
        onOpenChange={(open) => !open && setEditingDocument(null)}
        onSave={updateDocumentPermissions}
      />

      {/* 문서 상세 다이얼로그 */}
      <DocumentDetailDialog
        document={detailDocument}
        open={!!detailDocument}
        onOpenChange={(open) => !open && setDetailDocument(null)}
      />
    </div>
  );
}
