import { useState, useEffect } from "react";
import { AuditLog } from "../types";
import { auditLogs as mockLogs } from "../utils/mockData";

export function useAuditLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    const checkDarkMode = () => {
      const savedDarkMode = localStorage.getItem("darkMode") === "true";
      setIsDarkMode(savedDarkMode);
    };

    checkDarkMode();

    const handleThemeChange = () => {
      checkDarkMode();
    };

    window.addEventListener("themeChanged", handleThemeChange);
    return () => window.removeEventListener("themeChanged", handleThemeChange);
  }, []);

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actionKr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = selectedAction === "all" || log.action === selectedAction;
    const matchesSeverity =
      selectedSeverity === "all" || log.severity === selectedSeverity;
    return matchesSearch && matchesAction && matchesSeverity;
  });

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setIsDetailDialogOpen(true);
  };

  return {
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
    allLogs: mockLogs,
  };
}
