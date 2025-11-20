import { Badge } from "@/shared/ui/badge";
import { CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";

const STATUS_CONFIG: Record<
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

export const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.STABLE;

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

