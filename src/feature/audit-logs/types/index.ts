export interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  userId: number;
  action: string;
  actionKr: string;
  target: string;
  details: Record<string, unknown>;
  ipAddress: string;
  severity: "info" | "warning" | "error";
  status: "success" | "failed";
}

export const severityConfig = {
  info: {
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  warning: {
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  error: {
    color: "bg-red-100 text-red-700 border-red-200",
  },
};

export const statusConfig = {
  success: {
    color: "bg-green-100 text-green-700 border-green-200",
  },
  failed: {
    color: "bg-red-100 text-red-700 border-red-200",
  },
};
