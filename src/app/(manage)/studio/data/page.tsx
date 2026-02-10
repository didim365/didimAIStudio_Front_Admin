import { SubMenuPage } from "@/shared/components/SubMenuPage";
import { Cpu, FileText, Wrench, User, Bot, List } from "lucide-react";

export default function DataPage() {
  return (
    <SubMenuPage
      title="데이터 관리"
      description="사용자별 스튜디오 데이터를 관리합니다."
      items={[
        {
          name: "모델 관리",
          href: "/studio/data/models",
          icon: Cpu,
          description: "사용자 모델 데이터를 관리합니다.",
        },
        {
          name: "지식 관리",
          href: "/studio/data/indexing",
          icon: FileText,
          description: "벡터 인덱싱된 지식 데이터를 관리합니다.",
        },
        {
          name: "도구 관리",
          href: "/studio/data/tools",
          icon: Wrench,
          description: "사용자 도구 데이터를 관리합니다.",
        },
        {
          name: "페르소나 관리",
          href: "/studio/data/personas",
          icon: User,
          description: "사용자 페르소나 데이터를 관리합니다.",
        },
        {
          name: "에이전트 관리",
          href: "/studio/data/agents",
          icon: Bot,
          description: "사용자 에이전트 데이터를 관리합니다.",
        },
        {
          name: "시나리오 관리",
          href: "/studio/data/scenarios",
          icon: List,
          description: "사용자 시나리오 데이터를 관리합니다.",
        },
      ]}
    />
  );
}
