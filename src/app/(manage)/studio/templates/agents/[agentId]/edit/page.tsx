import AgentEditPage from "@/feature/studio/templates/agents/[agentId]/edit/_pages/AgentEditPage";
import getAgent from "@/feature/studio/templates/agents/[agentId]/_api/getAgent";

async function Page({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params;
  const agent = await getAgent({ agent_id: Number(agentId) });

  return <AgentEditPage agent={agent} />;
}

export default Page;
