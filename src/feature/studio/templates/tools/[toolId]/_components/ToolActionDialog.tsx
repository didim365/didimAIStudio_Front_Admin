"use client";

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
import { Loader2, Play, Rocket, StopCircle, Trash2 } from "lucide-react";
import {
  statusConfig,
  deploymentTypeConfig,
} from "../../_constants/toolConfigs";
import { ReactNode } from "react";

export type ToolActionType = "start" | "deploy" | "stop" | "delete";

interface ToolActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  actionType: ToolActionType;
  toolName: string;
  deploymentType?: string;
  status?: string;
  onConfirm: () => void;
  customDescription?: ReactNode;
}

const actionConfig: Record<
  ToolActionType,
  {
    icon: typeof Play;
    iconColor: string;
    title: string;
    confirmLabel: string;
    loadingLabel: string;
    buttonColor: string;
    dotColor: string;
  }
> = {
  start: {
    icon: Play,
    iconColor: "text-green-600",
    title: "도구 시작",
    confirmLabel: "시작",
    loadingLabel: "시작 중...",
    buttonColor:
      "from-green-600 to-green-700 hover:from-green-700 hover:to-green-800",
    dotColor: "bg-green-600",
  },
  deploy: {
    icon: Rocket,
    iconColor: "text-blue-600",
    title: "도구 배포",
    confirmLabel: "배포 시작",
    loadingLabel: "배포 중...",
    buttonColor:
      "from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
    dotColor: "bg-blue-600",
  },
  stop: {
    icon: StopCircle,
    iconColor: "text-orange-600",
    title: "도구 중지",
    confirmLabel: "중지 시작",
    loadingLabel: "중지 중...",
    buttonColor:
      "from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800",
    dotColor: "bg-orange-600",
  },
  delete: {
    icon: Trash2,
    iconColor: "text-red-600",
    title: "도구 삭제",
    confirmLabel: "삭제",
    loadingLabel: "삭제 중...",
    buttonColor: "",
    dotColor: "",
  },
};

export function ToolActionDialog({
  open,
  onOpenChange,
  isLoading,
  actionType,
  toolName,
  deploymentType,
  status,
  onConfirm,
  customDescription,
}: ToolActionDialogProps) {
  const config = actionConfig[actionType];
  const Icon = config.icon;

  const defaultDescription = (
    <>
      {actionType === "delete" ? (
        <>
          정말 <span className="font-semibold">{toolName}</span>을(를)
          삭제하시겠습니까?
          <br />
          <span className="text-destructive mt-2 block">
            이 작업은 되돌릴 수 없습니다.
          </span>
          <span className="text-muted-foreground mt-2 block text-xs">
            참고: 삭제 작업은 약 1분 정도 소요될 수 있습니다.
          </span>
        </>
      ) : (
        <>
          <span className="font-semibold">{toolName}</span>을(를)
          {actionType === "start" && " 시작"}
          {actionType === "deploy" && " 배포"}
          {actionType === "stop" && " 중지"}
          하시겠습니까?
          <br />
          {deploymentType && status && (
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${config.dotColor} mt-1.5 shrink-0`}
                />
                <span className="text-muted-foreground">
                  배포 타입:
                  <span className="font-medium text-foreground">
                    {deploymentTypeConfig[
                      deploymentType as keyof typeof deploymentTypeConfig
                    ]?.label || deploymentType}
                  </span>
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${config.dotColor} mt-1.5 shrink-0`}
                />
                <span className="text-muted-foreground">
                  현재 상태:
                  <span className="font-medium text-foreground">
                    {statusConfig[status as keyof typeof statusConfig]?.label ||
                      status}
                  </span>
                </span>
              </div>
            </div>
          )}
          <span className="text-muted-foreground mt-4 block text-xs">
            참고: {actionType === "start" && "시작"}
            {actionType === "deploy" && "배포"}
            {actionType === "stop" && "중지"} 작업은 비동기로 처리되며, 완료까지
            시간이 걸릴 수 있습니다.
          </span>
        </>
      )}
    </>
  );

  return (
    <AlertDialog
      open={open}
      onOpenChange={(open) => {
        // 로딩 중일 때는 모달을 닫을 수 없도록 함
        if (!isLoading) {
          onOpenChange(open);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${config.iconColor}`} />
            {config.title} {isLoading ? "중" : "확인"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {customDescription || defaultDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={
              config.buttonColor
                ? `flex items-center gap-2 bg-linear-to-r ${config.buttonColor}`
                : "flex items-center gap-2"
            }
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? config.loadingLabel : config.confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
