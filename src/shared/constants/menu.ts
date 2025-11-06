import {
  Brain,
  FileText,
  Group,
  LayoutDashboard,
  Shield,
  Users,
} from "lucide-react";

const MENU = [
  {
    name: "대시보드",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
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
    name: "권한 관리",
    href: "/roles",
    icon: Shield,
  },

  {
    name: "감사 로그",
    href: "/audit-logs",
    icon: FileText,
  },
  {
    name: "AI 서비스 관리",
    href: "/service",
    icon: Brain,
    children: [
      {
        name: "모델 관리",
        href: "/service/models",
      },
      {
        name: "도구 관리",
        href: "/service/tools",
      },
      {
        name: "페르소나 관리",
        href: "/service/personas",
      },
    ],
  },
  { name: "문서 관리", href: "/documents", icon: FileText },
];

export default MENU;
