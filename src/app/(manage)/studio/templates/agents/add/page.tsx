import AgentAddPage from "@/feature/studio/templates/agents/pages/AgentAddPage";
import getSettings from "@/feature/studio/data/models/_api/getSettings";

async function Page() {
  // 모델 설정 모두 불러오기
  const settings = await getSettings();

  return <AgentAddPage settings={settings} />;
}

export default Page;
