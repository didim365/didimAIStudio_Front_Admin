import { Brain, Group, Key, UserCog, Users } from "lucide-react";
import type { Route } from "next";

type MenuItem =
  | {
      name: string;
      href: Route;
      icon: React.ComponentType<{ className?: string }>;
      children?: never;
    }
  | {
      name: string;
      href: Route;
      icon: React.ComponentType<{ className?: string }>;
      children: Array<{
        name: string;
        href: Route;
      }>;
    };

const MENU: MenuItem[] = [
  // {
  //   name: "대시보드",
  //   href: "/dashboard",
  //   icon: LayoutDashboard,
  // },
  {
    name: "회원 관리",
    href: "/users",
    icon: Users,
  },
  {
    name: "그룹 관리",
    href: "/groups",
    icon: Group,
  },
  {
    name: "역할 관리",
    href: "/roles",
    icon: UserCog,
  },
  {
    name: "권한 관리",
    href: "/privileges",
    icon: Key,
  },
  {
    name: "스튜디오 템플릿 관리",
    href: "/studio",
    icon: Brain,
    children: [
      {
        name: "모델 관리",
        href: "/studio/models",
      },
      {
        name: "도구 관리",
        href: "/studio/tools",
      },
      {
        name: "페르소나 관리",
        href: "/studio/personas",
      },
      // {
      //   name: "에이전트 관리",
      //   href: "/studio/agents",
      // },
      {
        name: "시나리오 관리",
        href: "/studio/scenarios",
      },
    ],
  },
  // { name: "문서 관리", href: "/documents", icon: FileText },
];

export default MENU;
