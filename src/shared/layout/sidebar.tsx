"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Shield,
  FileText,
  LogOut,
  Brain,
  ChevronRight,
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
    name: "AI 서비스 관리",
    href: "/dashboard/service",
    icon: Brain,
    children: [
      {
        name: "모델 관리",
        href: "/dashboard/service/models",
      },
      {
        name: "도구 관리",
        href: "/dashboard/service/tools",
      },
      {
        name: "페르소나 관리",
        href: "/dashboard/service/personas",
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([""]);

  const toggleMenu = (menuName: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((name) => name !== menuName)
        : [...prev, menuName]
    );
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
            관
          </div>
          <div>
            <p className="text-sm font-semibold">관리자님</p>
            <p className="text-xs">admin@example.com</p>
          </div>
        </div>
        <Link href="/" className="w-full">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 mt-2 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </Button>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedMenus.includes(item.name);
          const isChildActive =
            hasChildren &&
            item.children?.some((child) => pathname === child.href);

          return (
            <div key={item.name}>
              {hasChildren && (
                <button
                  onClick={() => toggleMenu(item.name)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all text-muted-foreground hover:bg-muted hover:text-foreground duration-300",
                    (isActive || isChildActive) &&
                      "bg-primary text-primary-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="flex-1 text-left">{item.name}</span>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-transform duration-300",
                      isExpanded && "rotate-90"
                    )}
                  />
                </button>
              )}
              {!hasChildren && (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )}
              {hasChildren && isExpanded && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.children?.map((child) => {
                    const isChildItemActive = pathname === child.href;
                    return (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors text-muted-foreground hover:bg-muted hover:text-foreground",
                          isChildItemActive &&
                            "bg-primary/10 text-primary font-medium"
                        )}
                      >
                        <div className="w-5 flex items-center justify-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-current" />
                        </div>
                        {child.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
