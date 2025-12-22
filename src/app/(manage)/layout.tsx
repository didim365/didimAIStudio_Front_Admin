import React from "react";
import { Sidebar } from "@/shared/layout/sidebar";
import { ThemeSettings } from "@/shared/layout/theme-settings";
import { SidebarProvider, SidebarInset } from "@/shared/ui/sidebar";

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
        <ThemeSettings />
      </SidebarInset>
    </SidebarProvider>
  );
}
