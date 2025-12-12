import AgentAddPage from "@/feature/studio/templates/agents/pages/AgentAddPage";
import getSettings from "@/feature/studio/data/models/_api/getSettings";
import getPersonas from "@/feature/studio/data/personas/_api/getPersonas";

async function Page() {
  // 모델 설정 모두 불러오기
  const settings = await getSettings();

  // 페르소나 목록 불러오기
  const personas = await getPersonas();

  return <AgentAddPage settings={settings} personas={personas} />;
}

export default Page;
