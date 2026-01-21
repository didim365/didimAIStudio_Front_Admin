"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import {
  Hash,
  FileText,
  FolderOpen,
  Layers,
  Coins,
  Calendar,
  User,
  Shield,
} from "lucide-react";
import { formatNumber } from "@/shared/utils/formatNumber";
import { formatDate } from "@/shared/utils/formatDate";
import type { components } from "@/shared/types/api/indexing";

type VectorDataItem = components["schemas"]["AdminVectorDataItemDTO"];

interface VectorDetailDialogProps {
  item: VectorDataItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VectorDetailDialog({
  item,
  open,
  onOpenChange,
}: VectorDetailDialogProps) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[700px] max-h-[85vh] flex flex-col"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 pr-8">
            <Layers className="h-5 w-5 shrink-0" />
            <span className="truncate">{item.title || item.filename}</span>
            <Badge variant="secondary" className="ml-2 shrink-0">
              청크 #{item.chunk_index}
            </Badge>
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
                  icon={<FileText className="h-4 w-4" />}
                  label="파일명"
                  value={
                    <span className="break-all text-xs">{item.filename}</span>
                  }
                />
                <InfoItem
                  icon={<Layers className="h-4 w-4" />}
                  label="페이지 / 청크"
                  value={`${item.page_number}페이지 / ${item.chunk_index}번`}
                />
              </div>
            </section>

            <Separator />

            {/* 청크 텍스트 */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">
                청크 텍스트
              </h3>
              <div className="h-[200px] rounded-md border bg-muted/30 p-3 overflow-y-auto">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {item.parsed_text}
                </p>
              </div>
            </section>

            <Separator />

            {/* 토큰 & 비용 */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">
                토큰 & 비용
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem
                  icon={<Hash className="h-4 w-4" />}
                  label="토큰"
                  value={formatNumber(item.token)}
                />
                <InfoItem
                  icon={<Coins className="h-4 w-4" />}
                  label="비용"
                  value={`$${item.cost?.toFixed(4)}`}
                />
              </div>
            </section>

            <Separator />

            {/* 메타 정보 */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">
                메타 정보
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem
                  icon={<User className="h-4 w-4" />}
                  label="사용자 ID"
                  value={`#${item.user_id}`}
                />
                <InfoItem
                  icon={<Layers className="h-4 w-4" />}
                  label="그룹 ID"
                  value={`#${item.group_id}`}
                />
                <InfoItem
                  icon={<Shield className="h-4 w-4" />}
                  label="역할 ID"
                  value={
                    item.role_ids && item.role_ids.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {item.role_ids.map((roleId) => (
                          <Badge key={roleId} variant="outline" className="text-xs">
                            {roleId}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      "-"
                    )
                  }
                />
                <InfoItem
                  icon={<Calendar className="h-4 w-4" />}
                  label="날짜"
                  value={formatDate(item.date)}
                />
              </div>
            </section>

            <Separator />

            {/* 해시 정보 */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">
                해시 정보
              </h3>
              <div className="rounded-md bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground mb-1">SHA256</p>
                <p className="text-xs font-mono break-all">{item.hash_sha256}</p>
              </div>
            </section>
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
