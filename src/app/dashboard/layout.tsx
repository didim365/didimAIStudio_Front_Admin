"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/shared/layout/sidebar";
import { ThemeSettings } from "@/shared/layout/theme-settings";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main
        className="flex-1 overflow-y-auto p-8"
        style={{
          backgroundColor: isDarkMode ? "#000000" : "#ffffff",
          color: isDarkMode ? "#ffffff" : "inherit",
        }}
      >
        {children}
      </main>
      <ThemeSettings />
    </div>
  );
}
