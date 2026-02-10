"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import MENU from "@/shared/constants/menu";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

// 경로 세그먼트에 대한 한글 매핑
const SEGMENT_LABELS: Record<string, string> = {
  // 기본 페이지
  users: "회원 관리",
  groups: "그룹 관리",
  roles: "역할 관리",
  privileges: "권한 관리",
  studio: "스튜디오",

  // 스튜디오 하위
  templates: "템플릿 관리",
  data: "데이터 관리",
  models: "모델 관리",
  tools: "도구 관리",
  personas: "페르소나 관리",
  agents: "에이전트 관리",
  scenarios: "시나리오 관리",
  indexing: "지식 관리",
  public: "퍼블릭 API",
  local: "로컬 LLM",

  // 하위 페이지
  meta: "메타 데이터",
  vector: "벡터 데이터",

  // 공통 액션
  add: "추가",
  edit: "수정",
};

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

  return useMemo(() => {
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

      // 세그먼트 매핑에 있으면 사용
      if (SEGMENT_LABELS[segment]) {
        items.push({
          label: SEGMENT_LABELS[segment],
          href: currentPath,
        });
        continue;
      }

      // 동적 경로 세그먼트 (예: [userId], [collectionName])
      // UUID나 ID 패턴이면 "상세"로 표시
      if (isIdSegment(segment)) {
        items.push({
          label: "상세",
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
  }, [pathname]);
}

// ID 형식인지 확인 (UUID, 숫자 등)
function isIdSegment(segment: string): boolean {
  // UUID 패턴
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      segment
    )
  ) {
    return true;
  }
  // 숫자만으로 이루어진 경우
  if (/^\d+$/.test(segment)) {
    return true;
  }
  // 영숫자 조합의 짧은 ID (보통 컬렉션명 등은 더 길고 의미있는 이름)
  // 컬렉션명처럼 의미있는 이름은 제외
  return false;
}
