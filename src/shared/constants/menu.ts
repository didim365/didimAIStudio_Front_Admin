import { Brain, Group, Key, UserCog, Users } from "lucide-react";
import type { Route } from "next";

type MenuChildItem = {
  name: string;
  href: Route;
  children?: MenuChildItem[];
};

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
      children: MenuChildItem[];
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
    name: "스튜디오 관리",
    href: "/studio",
    icon: Brain,
    children: [
      {
        name: "템플릿 관리",
        href: "/studio/templates",
        children: [
          {
            name: "모델 관리",
            href: "/studio/templates/models",
          },
          {
            name: "도구 관리",
            href: "/studio/templates/tools",
          },
          {
            name: "페르소나 관리",
            href: "/studio/templates/personas",
          },
          {
            name: "에이전트 관리",
            href: "/studio/templates/agents",
          },
          {
            name: "시나리오 관리",
            href: "/studio/templates/scenarios",
          },
        ],
      },
      {
        name: "데이터 관리",
        href: "/studio/data",
        children: [
          {
            name: "모델 관리",
            href: "/studio/data/models",
          },
          {
            name: "도구 관리",
            href: "/studio/data/tools",
          },
          {
            name: "페르소나 관리",
            href: "/studio/data/personas",
          },
          {
            name: "에이전트 관리",
            href: "/studio/data/agents",
          },
          {
            name: "시나리오 관리",
            href: "/studio/data/scenarios",
          },
        ],
      },
    ],
  },
  // { name: "문서 관리", href: "/documents", icon: FileText },
];

export default MENU;
