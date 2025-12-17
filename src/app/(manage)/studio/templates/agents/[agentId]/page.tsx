import AgentPage from "@/feature/studio/templates/agents/[agentId]/_pages/AgentPage";
import getAgent from "@/feature/studio/templates/agents/[agentId]/_api/getAgent";

async function Page({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params;

  // SSR 데이터 패칭
  const agentData = await getAgent({ agent_id: Number(agentId) });

  return <AgentPage agent={agentData} />;
}

export default Page;
