import { SubMenuPage } from "@/shared/components/SubMenuPage";
import { Globe, Server } from "lucide-react";

export default function ModelsPage() {
  return (
    <SubMenuPage
      title="모델 관리"
      description="퍼블릭 API와 로컬 LLM 모델 템플릿을 관리합니다."
      items={[
        {
          name: "퍼블릭 모델",
          href: "/studio/templates/models/public",
          icon: Globe,
          description: "OpenAI, Anthropic 등 퍼블릭 API 모델을 관리합니다.",
        },
        {
          name: "로컬 모델",
          href: "/studio/templates/models/local",
          icon: Server,
          description: "온프레미스 환경의 로컬 LLM 모델을 관리합니다.",
        },
      ]}
    />
  );
}
