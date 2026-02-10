import { SubMenuPage } from "@/shared/components/SubMenuPage";
import { FileCode, Database } from "lucide-react";

export default function StudioPage() {
  return (
    <SubMenuPage
      title="스튜디오 관리"
      description="AI 스튜디오의 템플릿과 데이터를 관리합니다."
      items={[
        {
          name: "템플릿 관리",
          href: "/studio/templates",
          icon: FileCode,
          description: "모델, 도구, 페르소나, 에이전트, 시나리오 템플릿을 관리합니다.",
        },
        {
          name: "데이터 관리",
          href: "/studio/data",
          icon: Database,
          description: "사용자별 스튜디오 데이터를 관리합니다.",
        },
      ]}
    />
  );
}
