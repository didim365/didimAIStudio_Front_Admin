import React from "react";
import { Sidebar } from "@/shared/layout/sidebar";
import { ThemeSettings } from "@/shared/layout/theme-settings";

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
      <ThemeSettings />
    </div>
  );
}
