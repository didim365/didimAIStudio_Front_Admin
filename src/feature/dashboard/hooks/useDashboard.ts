import { useState, useEffect } from "react";
import {
  Users,
  Activity,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { MetricCardData } from "../types";

export function useDashboard() {
  const [themeKey, setThemeKey] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const savedDarkMode = localStorage.getItem("darkMode") === "true";
      setIsDarkMode(savedDarkMode);
    };

    checkDarkMode();

    const handleThemeChange = () => {
      checkDarkMode();
      setThemeKey((prev) => prev + 1);
    };

    window.addEventListener("themeChanged", handleThemeChange);
    return () => window.removeEventListener("themeChanged", handleThemeChange);
  }, []);

  const metricCards: MetricCardData[] = [
    {
      title: "전체 회원",
      value: 655,
      description: "지난 달 대비",
      icon: Users,
      trend: "+12%",
    },
    {
      title: "활성 사용자",
      value: 523,
      description: "활성률",
      icon: Activity,
      trend: "79.8%",
    },
    {
      title: "월간 비용",
      value: "₩2.73M",
      description: "지난 달 대비",
      icon: DollarSign,
      trend: "+8%",
    },
    {
      title: "권한 이슈",
      value: 3,
      description: "검토가 필요한 권한 변경 요청",
      icon: AlertCircle,
    },
  ];

  return {
    themeKey,
    isDarkMode,
    metricCards,
  };
}
