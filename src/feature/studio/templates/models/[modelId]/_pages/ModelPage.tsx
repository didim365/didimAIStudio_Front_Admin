"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  Calendar,
  Clock,
  Coins,
  Database,
  Hash,
  Link2,
  Pencil,
  Tag,
  Trash2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
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
import { formatDate } from "@/shared/utils/formatDate";
import type { GetCatalogResponse } from "../_api/getCatalog";
import { getStatusBadgeVariant } from "../_utils/getStatusBadgeVariant";
import { formatNumber, formatCurrency } from "../_utils/formatters";
import { getInitials } from "../_utils/getInitials";
import { InfoRow } from "../_components/InfoRow";
import { useDeleteCatalog } from "../_hooks/useDeleteCatalog";

interface ModelPageProps {
  catalog: GetCatalogResponse;
}

function ModelPage({ catalog }: ModelPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // 모델 삭제 mutation
  const { mutate: deleteCatalog, isPending: isDeleting } = useDeleteCatalog({
    onSuccess: () => {
      // 모델 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ["catalogs"],
      });
      queryClient.invalidateQueries({
        queryKey: ["catalog"],
      });
      setShowDeleteDialog(false);
      router.push("/studio/templates/models");
    },
    meta: {
      successMessage: "모델이 성공적으로 삭제되었습니다.",
    },
  });

  const handleDelete = () => {
    deleteCatalog({ model_id: catalog.id });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/studio/templates/models">
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
              템플릿 모델 상세 정보
            </h1>
            <p className="text-muted-foreground">모델 ID: {catalog.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/studio/templates/models/${catalog.id}/edit`}>
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
            <AlertDialogTitle>모델 삭제 확인</AlertDialogTitle>
            <AlertDialogDescription>
              정말 <span className="font-semibold">{catalog.model_name}</span>
              을(를) 삭제하시겠습니까?
              <br />
              <span className="text-destructive mt-2 block">
                이 작업은 되돌릴 수 없습니다.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Logo / Status */}
                <div className="flex flex-col items-center gap-4 min-w-[150px]">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                    <AvatarImage
                      src={catalog.logo || undefined}
                      alt={catalog.model_name}
                    />
                    <AvatarFallback className="text-3xl">
                      {getInitials(catalog.model_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Badge variant={getStatusBadgeVariant(catalog.status)}>
                      {catalog.status}
                    </Badge>
                    <Badge variant="outline">{catalog.category}</Badge>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="flex-1 grid gap-4 md:grid-cols-2">
                  <InfoRow
                    icon={<Hash className="h-4 w-4" />}
                    label="모델명"
                    value={catalog.model_name}
                  />
                  <InfoRow
                    icon={<Tag className="h-4 w-4" />}
                    label="제공자"
                    value={catalog.provider}
                  />
                  <InfoRow
                    icon={<Tag className="h-4 w-4" />}
                    label="버전"
                    value={catalog.version || "N/A"}
                  />
                  <InfoRow
                    icon={<Link2 className="h-4 w-4" />}
                    label="엔드포인트 URL"
                    value={
                      catalog.endpoints_url ? (
                        <a
                          href={catalog.endpoints_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary underline underline-offset-4 break-all"
                        >
                          {catalog.endpoints_url}
                        </a>
                      ) : (
                        "N/A"
                      )
                    }
                    valueClassName="break-all"
                  />
                  <InfoRow
                    icon={<Calendar className="h-4 w-4" />}
                    label="생성일"
                    value={formatDate(catalog.created_at)}
                  />
                  <InfoRow
                    icon={<Clock className="h-4 w-4" />}
                    label="최근 수정일"
                    value={formatDate(catalog.updated_at)}
                  />
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  설명
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm leading-relaxed">
                  {catalog.description?.trim() || "설명이 없습니다."}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Limits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                비용 (per token)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoRow
                  icon={<Coins className="h-4 w-4" />}
                  label="입력($)"
                  value={formatCurrency(catalog.input_cost_per_token)}
                />
                <InfoRow
                  icon={<Coins className="h-4 w-4" />}
                  label="출력($)"
                  value={formatCurrency(catalog.output_cost_per_token)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                토큰 제한
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <InfoRow
                icon={<Hash className="h-4 w-4" />}
                label="최대 토큰"
                value={formatNumber(catalog.max_tokens)}
              />
              <InfoRow
                icon={<Hash className="h-4 w-4" />}
                label="최대 입력"
                value={formatNumber(catalog.max_input_tokens)}
              />
              <InfoRow
                icon={<Hash className="h-4 w-4" />}
                label="최대 출력"
                value={formatNumber(catalog.max_output_tokens)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ModelPage;
