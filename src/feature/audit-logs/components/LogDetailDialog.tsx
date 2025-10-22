import { AuditLog, severityConfig, statusConfig } from "../types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Badge } from "@/shared/ui/badge";

interface LogDetailDialogProps {
  log: AuditLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LogDetailDialog({ log, isOpen, onClose }: LogDetailDialogProps) {
  if (!log) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>감사 로그 상세 정보</DialogTitle>
          <DialogDescription>로그 ID: {log.id}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm font-medium text-slate-600">시간</div>
              <div className="text-sm text-slate-900">{log.timestamp}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-slate-600">사용자</div>
              <div className="text-sm text-slate-900">
                {log.user} (ID: {log.userId})
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium text-slate-600">작업</div>
            <div className="flex items-center gap-2">
              <Badge>{log.actionKr}</Badge>
              <span className="text-sm text-slate-500">{log.action}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium text-slate-600">대상</div>
            <div className="text-sm text-slate-900">{log.target}</div>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium text-slate-600">상세 정보</div>
            <div className="border rounded-lg p-4 bg-slate-50">
              <pre className="text-xs overflow-auto">
                {JSON.stringify(log.details, null, 2)}
              </pre>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="text-sm font-medium text-slate-600">IP 주소</div>
              <div className="text-sm font-mono text-slate-900">
                {log.ipAddress}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-slate-600">심각도</div>
              <Badge variant="outline" className={severityConfig[log.severity].color}>
                {log.severity}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-slate-600">상태</div>
              <Badge variant="outline" className={statusConfig[log.status].color}>
                {log.status}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
