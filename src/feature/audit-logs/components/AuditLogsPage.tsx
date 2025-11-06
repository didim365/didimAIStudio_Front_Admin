"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Calendar } from "@/shared/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Search, Download, CalendarIcon } from "lucide-react";
import { ko } from "date-fns/locale";
import { useAuditLogs } from "../hooks/useAuditLogs";
import { StatsCards } from "./StatsCards";
import { LogsTable } from "./LogsTable";
import { LogDetailDialog } from "./LogDetailDialog";

export default function AuditLogsPage() {
  const {
    searchQuery,
    setSearchQuery,
    selectedAction,
    setSelectedAction,
    selectedSeverity,
    setSelectedSeverity,
    selectedLog,
    isDetailDialogOpen,
    setIsDetailDialogOpen,
    isDarkMode,
    dateRange,
    setDateRange,
    filteredLogs,
    handleViewDetails,
    allLogs,
  } = useAuditLogs();

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ color: isDarkMode ? "#ffffff" : undefined }}
        >
          감사 로그
        </h1>
        <p
          className="mt-2"
          style={{ color: isDarkMode ? "#cccccc" : undefined }}
        >
          시스템의 모든 역할 변경 및 중요 활동 기록
        </p>
      </div>

      {/* 통계 카드 */}
      <StatsCards logs={allLogs} isDarkMode={isDarkMode} />

      {/* 검색 및 필터 */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="사용자, 작업, 대상으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="작업 유형" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 작업</SelectItem>
                  <SelectItem value="ROLE_UPDATED">역할 변경</SelectItem>
                  <SelectItem value="PERMISSION_GRANTED">역할 부여</SelectItem>
                  <SelectItem value="USER_LIMIT_UPDATED">제한 변경</SelectItem>
                  <SelectItem value="GROUP_CREATED">그룹 생성</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedSeverity}
                onValueChange={setSelectedSeverity}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="심각도" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 심각도</SelectItem>
                  <SelectItem value="info">정보</SelectItem>
                  <SelectItem value="warning">경고</SelectItem>
                  <SelectItem value="error">오류</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    기간
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) =>
                      setDateRange({ from: range?.from, to: range?.to })
                    }
                    locale={ko}
                  />
                </PopoverContent>
              </Popover>

              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                내보내기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 로그 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            감사 로그 기록 ({filteredLogs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LogsTable
            logs={filteredLogs}
            isDarkMode={isDarkMode}
            onViewDetails={handleViewDetails}
          />
        </CardContent>
      </Card>

      {/* 상세 다이얼로그 */}
      <LogDetailDialog
        log={selectedLog}
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
      />
    </div>
  );
}
