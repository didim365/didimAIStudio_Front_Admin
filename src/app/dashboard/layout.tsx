"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sidebar } from "@/shared/layout/sidebar";
import { ThemeSettings } from "@/shared/layout/theme-settings";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleThemeChange = () => {
      // 다크모드에 따라 body 스타일 업데이트
      if (theme === "dark") {
        document.body.style.backgroundColor = '#000000';
        document.body.style.color = '#ffffff';
      } else {
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.color = '#000000';
      }
    };

    handleThemeChange();
    window.addEventListener("themeChanged", handleThemeChange);
    return () => window.removeEventListener("themeChanged", handleThemeChange);
  }, [theme]);

  const isDarkMode = theme === "dark";

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main
        className="flex-1 overflow-y-auto p-8"
        style={{
          backgroundColor: mounted ? (isDarkMode ? "#000000" : "#ffffff") : undefined,
          color: mounted ? (isDarkMode ? "#ffffff" : "inherit") : undefined,
        }}
      >
        {children}
      </main>
      <ThemeSettings />
    </div>
  );
}
