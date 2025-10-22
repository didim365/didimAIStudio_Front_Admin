import { AuditLog, severityConfig, statusConfig } from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { User, Shield, AlertCircle, CheckCircle, Info } from "lucide-react";

interface LogsTableProps {
  logs: AuditLog[];
  isDarkMode: boolean;
  onViewDetails: (log: AuditLog) => void;
}

const severityIcons = {
  info: Info,
  warning: AlertCircle,
  error: AlertCircle,
};

const statusIcons = {
  success: CheckCircle,
  failed: AlertCircle,
};

export function LogsTable({ logs, isDarkMode, onViewDetails }: LogsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>시간</TableHead>
          <TableHead>사용자</TableHead>
          <TableHead>작업</TableHead>
          <TableHead>대상</TableHead>
          <TableHead>IP 주소</TableHead>
          <TableHead>심각도</TableHead>
          <TableHead>상태</TableHead>
          <TableHead className="text-right">상세</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => {
          const SeverityIcon = severityIcons[log.severity];
          const StatusIcon = statusIcons[log.status];

          return (
            <TableRow key={log.id}>
              <TableCell>
                <div
                  className="text-sm whitespace-nowrap"
                  style={{ color: isDarkMode ? "#cccccc" : undefined }}
                >
                  {log.timestamp}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  <div>
                    <div
                      className="font-medium"
                      style={{ color: isDarkMode ? "#ffffff" : undefined }}
                    >
                      {log.user}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: isDarkMode ? "#cccccc" : undefined }}
                    >
                      ID: {log.userId}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <div>
                    <div
                      className="font-medium"
                      style={{ color: isDarkMode ? "#ffffff" : undefined }}
                    >
                      {log.actionKr}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: isDarkMode ? "#cccccc" : undefined }}
                    >
                      {log.action}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div
                  className="text-sm"
                  style={{ color: isDarkMode ? "#cccccc" : undefined }}
                >
                  {log.target}
                </div>
              </TableCell>
              <TableCell>
                <div
                  className="text-sm font-mono"
                  style={{ color: isDarkMode ? "#cccccc" : undefined }}
                >
                  {log.ipAddress}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={severityConfig[log.severity].color}>
                  <SeverityIcon className="h-3 w-3 mr-1" />
                  {log.severity}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={statusConfig[log.status].color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {log.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => onViewDetails(log)}>
                  상세보기
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
