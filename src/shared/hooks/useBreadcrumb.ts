"use client";

import { usePathname } from "next/navigation";
import MENU from "@/shared/constants/menu";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

// 메뉴에서 경로-이름 매핑 추출
function extractPathLabelsFromMenu(): Record<string, string> {
  const pathLabels: Record<string, string> = {};

  function traverse(items: typeof MENU) {
    for (const item of items) {
      pathLabels[item.href] = item.name;
      if ("children" in item && item.children) {
        traverse(item.children);
      }
    }
  }

  traverse(MENU);
  return pathLabels;
}

const MENU_PATH_LABELS = extractPathLabelsFromMenu();

export function useBreadcrumb(): BreadcrumbItem[] {
  const pathname = usePathname();

  if (!pathname || pathname === "/") return [];

  const segments = pathname.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [];
  let currentPath = "";

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    // 메뉴에 정의된 경로가 있으면 해당 이름 사용
    if (MENU_PATH_LABELS[currentPath]) {
      items.push({
        label: MENU_PATH_LABELS[currentPath],
        href: currentPath,
      });
      continue;
    }

    // 그 외에는 세그먼트 그대로 표시
    items.push({
      label: segment,
      href: currentPath,
    });
  }

  return items;
}
