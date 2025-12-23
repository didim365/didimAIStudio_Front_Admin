import { Badge } from "@/shared/ui/badge";
import { PlayCircle, PauseCircle, AlertCircle, XCircle, Clock } from "lucide-react";

type GPUStackModelStatus = "pending" | "running" | "stopped" | "failed" | "unknown";

const STATUS_CONFIG: Record<
  GPUStackModelStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ReactNode;
  }
> = {
  running: {
    label: "실행 중",
    variant: "default",
    icon: <PlayCircle className="h-3 w-3" />,
  },
  stopped: {
    label: "중지됨",
    variant: "secondary",
    icon: <PauseCircle className="h-3 w-3" />,
  },
  pending: {
    label: "대기 중",
    variant: "outline",
    icon: <Clock className="h-3 w-3" />,
  },
  failed: {
    label: "실패",
    variant: "destructive",
    icon: <XCircle className="h-3 w-3" />,
  },
  unknown: {
    label: "알 수 없음",
    variant: "outline",
    icon: <AlertCircle className="h-3 w-3" />,
  },
};

export const DeploymentStatusBadge = ({
  status,
}: {
  status: GPUStackModelStatus;
}) => {
  const statusConfig =
    STATUS_CONFIG[status] || STATUS_CONFIG.unknown;

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

