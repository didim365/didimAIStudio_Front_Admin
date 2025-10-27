"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Shield,
  FileText,
  LogOut,
  File,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

const navigation = [
  {
    name: "대시보드",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "회원 관리",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    name: "권한 관리",
    href: "/dashboard/permissions",
    icon: Shield,
  },
  {
    name: "감사 로그",
    href: "/dashboard/audit-logs",
    icon: FileText,
  },
  {
    name: "문서 관리",
    href: "/dashboard/documents",
    icon: File,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // 다크모드 상태 확인
    const checkDarkMode = () => {
      const savedDarkMode = localStorage.getItem("darkMode") === "true";
      setIsDarkMode(savedDarkMode);
    };

    checkDarkMode();

    // 테마 변경 이벤트 리스너
    const handleThemeChange = () => {
      checkDarkMode();
    };

    window.addEventListener("themeChanged", handleThemeChange);
    return () => window.removeEventListener("themeChanged", handleThemeChange);
  }, []);

  return (
    <div
      className="flex h-screen w-64 flex-col border-r"
      style={{
        backgroundColor: isDarkMode
          ? "#000000"
          : "lab(96.52% -.0000298023 .0000119209)",
        color: isDarkMode ? "#ffffff" : "inherit",
      }}
    >
      <div
        className="p-6 border-b"
        style={{ borderColor: isDarkMode ? "#333333" : undefined }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
            관
          </div>
          <div>
            <p
              className="text-sm font-semibold"
              style={{ color: isDarkMode ? "#ffffff" : undefined }}
            >
              관리자님
            </p>
            <p
              className="text-xs"
              style={{ color: isDarkMode ? "#cccccc" : undefined }}
            >
              admin@example.com
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 mt-2"
          style={{
            borderColor: isDarkMode ? "#666666" : undefined,
            color: isDarkMode ? "#ffffff" : undefined,
            backgroundColor: isDarkMode ? "transparent" : undefined,
          }}
        >
          <LogOut className="h-4 w-4" />
          로그아웃
        </Button>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : isDarkMode
                  ? "text-white hover:bg-gray-800 hover:text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
