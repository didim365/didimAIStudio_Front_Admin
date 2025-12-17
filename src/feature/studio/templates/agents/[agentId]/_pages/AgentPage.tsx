"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/agents";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
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
  Bot,
  Calendar,
  FileText,
  Globe,
  Lock,
  Settings,
  ArrowLeft,
  Pencil,
  Trash2,
  User,
  Cpu,
  Sparkles,
  Wrench,
  Shield,
  Tag,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { formatDate } from "@/shared/utils/formatDate";
import { CATEGORY_LABELS } from "../../_constants/agentCategoryConstants";
import { useDeleteAgent } from "../_hooks/useDeleteAgent";

type GetAgentResponse =
  paths["/v1/agents/data/{agent_id}"]["get"]["responses"]["200"]["content"]["application/json"];

interface AgentPageProps {
  agent: GetAgentResponse;
}

function AgentPage({ agent }: AgentPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // 에이전트 삭제 mutation
  const { mutate: deleteAgent, isPending: isDeleting } = useDeleteAgent({
    onSuccess: () => {
      // 에이전트 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ["agents"],
      });
      setShowDeleteDialog(false);
      router.push("/studio/templates/agents");
    },
    meta: {
      successMessage: "에이전트가 성공적으로 삭제되었습니다.",
    },
  });

  const handleDelete = () => {
    deleteAgent({ agent_id: agent.id });
  };

  const categoryLabel = CATEGORY_LABELS[agent.category] || agent.category;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/studio/templates/agents">
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
              에이전트 상세 정보
            </h1>
            <p className="text-muted-foreground">에이전트 ID: {agent.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/studio/templates/agents/${agent.id}/edit`}>
            <Button className="cursor-pointer">
              <Pencil className="h-4 w-4 mr-2" />
              수정
            </Button>
          </Link>
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
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
            <AlertDialogTitle>에이전트 삭제 확인</AlertDialogTitle>
            <AlertDialogDescription>
              정말
              <span className="font-semibold">{agent.name}</span>
              를 삭제하시겠습니까?
              <br />
              <span className="text-destructive mt-2 block">
                이 작업은 되돌릴 수 없습니다.
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

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            에이전트 상세 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-6">
              {/* Name and Category */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Tag className="h-4 w-4" />
                      <span className="font-medium">에이전트 이름</span>
                    </div>
                    <p className="text-2xl font-bold pl-6">{agent.name}</p>
                  </div>

                  {/* User Agent Title */}
                  {agent.user_agent_title && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">사용자 정의 제목</span>
                      </div>
                      <p className="text-lg font-semibold pl-6">
                        {agent.user_agent_title}
                      </p>
                    </div>
                  )}

                  {/* Category */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Sparkles className="h-4 w-4" />
                      <span className="font-medium">카테고리</span>
                    </div>
                    <div className="pl-6">
                      <Badge variant="secondary" className="text-sm">
                        {categoryLabel}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-col gap-3">
                  <Badge
                    variant={agent.is_system ? "default" : "outline"}
                    className="w-fit"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    {agent.is_system ? "시스템 에이전트" : "사용자 에이전트"}
                  </Badge>
                  <Badge
                    variant={agent.is_public ? "default" : "secondary"}
                    className="w-fit"
                  >
                    {agent.is_public ? (
                      <>
                        <Globe className="h-3 w-3 mr-1" />
                        공개
                      </>
                    ) : (
                      <>
                        <Lock className="h-3 w-3 mr-1" />
                        비공개
                      </>
                    )}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>공식 설명</span>
                </div>
                <div className="ml-6 p-4 bg-muted rounded-lg border border-border">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {agent.description || "설명 없음"}
                  </p>
                </div>
              </div>

              {/* User Agent Description */}
              {agent.user_agent_description && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>사용자 정의 설명</span>
                    </div>
                    <div className="ml-6 p-4 bg-muted rounded-lg border border-border">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {agent.user_agent_description}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <Separator />

            {/* Configuration and Activity Information Section */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Configuration Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-sm font-medium mb-4">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span>설정 정보</span>
                </div>

                {/* User ID */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="font-medium">소유자 ID</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">{agent.user_id}</p>
                </div>

                <Separator />

                {/* Model My Page ID */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Cpu className="h-4 w-4" />
                    <span className="font-medium">모델 ID</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    {agent.model_my_page_id}
                  </p>
                </div>

                {/* Fallback Model My Page ID */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Cpu className="h-4 w-4" />
                    <span className="font-medium">폴백 모델 ID</span>
                  </div>
                  <p className="text-lg font-semibold pl-6">
                    {agent.fallback_model_my_page_id}
                  </p>
                </div>

                {/* Persona My Page ID */}
                {agent.persona_my_page_id && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Sparkles className="h-4 w-4" />
                      <span className="font-medium">페르소나 ID</span>
                    </div>
                    <p className="text-lg font-semibold pl-6">
                      {agent.persona_my_page_id}
                    </p>
                  </div>
                )}

                {/* Tool My Page IDs */}
                {agent.tool_my_page_id && agent.tool_my_page_id.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Wrench className="h-4 w-4" />
                      <span className="font-medium">도구 ID 목록</span>
                    </div>
                    <div className="pl-6 flex flex-wrap gap-2">
                      {agent.tool_my_page_id.map((toolId) => (
                        <Badge key={toolId} variant="outline">
                          {toolId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Activity Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-sm font-medium mb-4">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>활동 정보</span>
                </div>

                {/* Created At */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>생성일</span>
                  </div>
                  <div className="ml-6 p-3 bg-muted rounded-lg border border-border">
                    <p className="text-sm font-mono">
                      {formatDate(agent.created_at)}
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
                      {formatDate(agent.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AgentPage;
