"use client";

import { components } from "@/shared/types/api/models";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { formatDate } from "@/shared/utils/formatDate";
import { useRouter } from "next/navigation";

type GenAIModel = components["schemas"]["GenAIResponseDTO"];

export interface ModelTableProps {
  models: GenAIModel[];
}

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    TEXT: "텍스트",
    IMAGE: "이미지",
    MULTIMODAL: "멀티모달",
    EMBEDDING: "임베딩",
    AUDIO: "오디오",
    VIDEO: "비디오",
    CHAT: "채팅",
    COMPLETION: "완성",
    IMAGE_GENERATION: "이미지 생성",
    AUDIO_TRANSCRIPTION: "오디오 변환",
    AUDIO_SPEECH: "음성 합성",
  };
  return labels[category] || category;
};

const getStatusBadge = (status: string) => {
  const config: Record<
    string,
    {
      label: string;
      variant: "default" | "secondary" | "destructive";
      icon: React.ReactNode;
    }
  > = {
    STABLE: {
      label: "안정",
      variant: "default",
      icon: <CheckCircle className="h-3 w-3" />,
    },
    BETA: {
      label: "베타",
      variant: "secondary",
      icon: <Clock className="h-3 w-3" />,
    },
    ALPHA: {
      label: "알파",
      variant: "secondary",
      icon: <AlertCircle className="h-3 w-3" />,
    },
    DEPRECATED: {
      label: "지원종료",
      variant: "destructive",
      icon: <XCircle className="h-3 w-3" />,
    },
  };

  const statusConfig = config[status] || config.STABLE;

  return (
    <Badge
      variant={statusConfig.variant}
      className="flex items-center gap-1 w-fit"
    >
      {statusConfig.icon}
      {statusConfig.label}
    </Badge>
  );
};

const formatNumber = (num: number | null | undefined) => {
  if (num === null || num === undefined) return "-";
  return num.toLocaleString();
};

const formatCost = (cost: number | null | undefined) => {
  if (cost === null || cost === undefined) return "-";
  return `$${cost.toFixed(6)}`;
};

export default function ModelTable({ models }: ModelTableProps) {
  const router = useRouter();
  if (models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <AlertCircle className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">모델을 찾을 수 없습니다</p>
        <p className="text-sm">필터 조건을 변경해보세요</p>
      </div>
    );
  }

  function handleRowClick(modelId: number) {
    router.push(`/studio/models/${modelId}`);
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[5%]">ID</TableHead>
              <TableHead className="text-left w-[15%]">모델</TableHead>
              <TableHead className="text-center w-[8%]">카테고리</TableHead>
              <TableHead className="text-left w-[6%]">버전</TableHead>
              <TableHead className="text-center w-[7%]">상태</TableHead>
              <TableHead className="text-center w-[8%]">최대 토큰</TableHead>
              <TableHead className="text-center w-[8%]">입력 토큰</TableHead>
              <TableHead className="text-center w-[8%]">출력 토큰</TableHead>
              <TableHead className="text-center w-[9%]">입력 비용</TableHead>
              <TableHead className="text-center w-[9%]">출력 비용</TableHead>
              <TableHead className="text-center w-[10%]">생성일</TableHead>
              <TableHead className="text-center w-[7%]">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map((model) => (
              <TableRow
                key={model.id}
                className="group cursor-pointer hover:bg-slate-50"
                onClick={() => handleRowClick(model.id)}
              >
                <TableCell className="text-center font-mono text-sm text-muted-foreground">
                  {model.id}
                </TableCell>
                <TableCell className="text-left">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={model.logo || undefined}
                        alt={model.model_name}
                      />
                      <AvatarFallback>
                        {model.model_name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{model.model_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {model.provider}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Badge variant="outline">
                      {getCategoryLabel(model.category)}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-left">
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    v{model.version}
                  </code>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    {getStatusBadge(model.status)}
                  </div>
                </TableCell>
                <TableCell className="text-center font-mono text-sm">
                  {formatNumber(model.max_tokens)}
                </TableCell>
                <TableCell className="text-center font-mono text-sm">
                  {formatNumber(model.max_input_tokens)}
                </TableCell>
                <TableCell className="text-center font-mono text-sm">
                  {formatNumber(model.max_output_tokens)}
                </TableCell>
                <TableCell className="text-center font-mono text-sm">
                  {formatCost(model.input_cost_per_token)}
                </TableCell>
                <TableCell className="text-center font-mono text-sm">
                  {formatCost(model.output_cost_per_token)}
                </TableCell>
                <TableCell className="text-center text-sm text-muted-foreground">
                  {formatDate(model.created_at)}
                </TableCell>
                <TableCell className="text-center">
                  {model.endpoints_url && (
                    <div className="flex justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          window.open(model.endpoints_url!, "_blank")
                        }
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {models.length > 0 && (
        <div className="mt-4 text-sm text-muted-foreground">
          <p className="font-medium mb-2">모델 설명:</p>
          <div className="space-y-2">
            {models.slice(0, 3).map(
              (model) =>
                model.description && (
                  <div key={model.id} className="pl-4 border-l-2 border-muted">
                    <span className="font-medium">{model.model_name}:</span>{" "}
                    {model.description}
                  </div>
                )
            )}
          </div>
        </div>
      )}
    </>
  );
}
