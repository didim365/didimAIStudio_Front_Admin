import { SubMenuPage } from "@/shared/components/SubMenuPage";
import { Cpu, Wrench, User, Bot, List } from "lucide-react";

export default function TemplatesPage() {
  return (
    <SubMenuPage
      title="템플릿 관리"
      description="스튜디오에서 사용할 수 있는 템플릿을 관리합니다."
      items={[
        {
          name: "모델 관리",
          href: "/studio/templates/models",
          icon: Cpu,
          description: "퍼블릭 API와 로컬 LLM 모델을 관리합니다.",
        },
        {
          name: "도구 관리",
          href: "/studio/templates/tools",
          icon: Wrench,
          description: "에이전트가 사용할 수 있는 도구 템플릿을 관리합니다.",
        },
        {
          name: "페르소나 관리",
          href: "/studio/templates/personas",
          icon: User,
          description: "AI 페르소나 템플릿을 관리합니다.",
        },
        {
          name: "에이전트 관리",
          href: "/studio/templates/agents",
          icon: Bot,
          description: "AI 에이전트 템플릿을 관리합니다.",
        },
        {
          name: "시나리오 관리",
          href: "/studio/templates/scenarios",
          icon: List,
          description: "워크플로우 시나리오 템플릿을 관리합니다.",
        },
      ]}
    />
  );
}
