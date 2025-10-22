import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { AuditLog } from "../types";

interface StatsCardsProps {
  logs: AuditLog[];
  isDarkMode: boolean;
}

export function StatsCards({ logs, isDarkMode }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle
            className="text-sm font-medium"
            style={{ color: isDarkMode ? "#cccccc" : undefined }}
          >
            전체 로그
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">{logs.length}</div>
          <p
            className="text-xs mt-1"
            style={{ color: isDarkMode ? "#999999" : undefined }}
          >
            최근 24시간
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle
            className="text-sm font-medium"
            style={{ color: isDarkMode ? "#cccccc" : undefined }}
          >
            성공
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            {logs.filter((l) => l.status === "success").length}
          </div>
          <p
            className="text-xs mt-1"
            style={{ color: isDarkMode ? "#999999" : undefined }}
          >
            정상 처리
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle
            className="text-sm font-medium"
            style={{ color: isDarkMode ? "#cccccc" : undefined }}
          >
            경고
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600">
            {logs.filter((l) => l.severity === "warning").length}
          </div>
          <p
            className="text-xs mt-1"
            style={{ color: isDarkMode ? "#999999" : undefined }}
          >
            주의 필요
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle
            className="text-sm font-medium"
            style={{ color: isDarkMode ? "#cccccc" : undefined }}
          >
            오류
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600">
            {logs.filter((l) => l.severity === "error").length}
          </div>
          <p
            className="text-xs mt-1"
            style={{ color: isDarkMode ? "#999999" : undefined }}
          >
            즉시 조치
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
