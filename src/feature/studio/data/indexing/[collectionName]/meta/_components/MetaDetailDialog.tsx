"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import {
  FileText,
  Hash,
  FileType,
  HardDrive,
  Layers,
  Coins,
  Calendar,
  Download,
  FolderOpen,
  Clock,
  Sparkles,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { formatNumber } from "@/shared/utils/formatNumber";
import { formatBytes } from "@/shared/utils/formatBytes";
import { formatDate } from "@/shared/utils/formatDate";
import { getStatusBadge } from "../_utils/getStatusBadge";
import { getFileTypeStyle } from "../_utils/getFileTypeStyle";
import type { components } from "@/shared/types/api/indexing";

type MetaDataItem = components["schemas"]["AdminMetaDataItemDTO"];

interface MetaDetailDialogProps {
  item: MetaDataItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MetaDetailDialog({
  item,
  open,
  onOpenChange,
}: MetaDetailDialogProps) {
  const statusBadge = getStatusBadge(item.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[600px] max-h-[85vh] flex flex-col"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 pr-8">
            <FileText className="h-5 w-5 shrink-0" />
            <span className="truncate">{item.title || item.filename}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 -mx-6 px-6 overflow-y-auto">
          <div className="space-y-6 pb-2">
            {/* 기본 정보 */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">
                기본 정보
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem
                  icon={<Hash className="h-4 w-4" />}
                  label="ID"
                  value={`#${item.id}`}
                />
                <InfoItem
                  icon={<FolderOpen className="h-4 w-4" />}
                  label="카테고리"
                  value={item.category || "-"}
                />
                <InfoItem
                  icon={<FileType className="h-4 w-4" />}
                  label="파일 타입"
                  value={
                    <Badge
                      variant="outline"
                      className={cn(
                        "gap-1 uppercase",
                        getFileTypeStyle(item.file_type)
                      )}
                    >
                      {item.file_type}
                    </Badge>
                  }
                />
                <InfoItem
                  icon={
                    item.status === "completed" ? (
                      <Sparkles className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )
                  }
                  label="상태"
                  value={
                    <Badge variant={statusBadge.variant} className="gap-1">
                      {statusBadge.label}
                    </Badge>
                  }
                />
              </div>
            </section>

            <Separator />

            {/* 제목 & 파일명 */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">
                문서 정보
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">제목</p>
                  <p className="text-sm font-medium">{item.title || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">파일명</p>
                  <p className="text-sm font-medium break-all">
                    {item.filename}
                  </p>
                </div>
                {item.summary && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">요약</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                )}
              </div>
            </section>

            <Separator />

            {/* 파일 & 청크 정보 */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">
                파일 & 청크 정보
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem
                  icon={<HardDrive className="h-4 w-4" />}
                  label="파일 크기"
                  value={formatBytes(item.file_size)}
                />
                <InfoItem
                  icon={<Layers className="h-4 w-4" />}
                  label="청크 수"
                  value={formatNumber(item.chunk_count)}
                />
                <InfoItem
                  icon={<Hash className="h-4 w-4" />}
                  label="토큰"
                  value={formatNumber(item.token)}
                />
                <InfoItem
                  icon={<Coins className="h-4 w-4" />}
                  label="비용"
                  value={`$${item.cost.toFixed(4)}`}
                />
              </div>
            </section>

            <Separator />

            {/* 날짜 정보 */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">
                날짜 정보
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem
                  icon={<Calendar className="h-4 w-4" />}
                  label="시작일"
                  value={formatDate(item.start_date)}
                />
                <InfoItem
                  icon={<Calendar className="h-4 w-4" />}
                  label="종료일"
                  value={formatDate(item.end_date)}
                />
                <InfoItem
                  icon={<Calendar className="h-4 w-4" />}
                  label="만료일"
                  value={formatDate(item.expiration_date)}
                />
              </div>
            </section>

            {/* 다운로드 버튼 */}
            {item.download_url && (
              <>
                <Separator />
                <section>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => window.open(item.download_url, "_blank")}
                  >
                    <Download className="h-4 w-4" />
                    파일 다운로드
                  </Button>
                </section>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-muted-foreground mt-0.5">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}
