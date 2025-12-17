import AgentEditPage from "@/feature/studio/templates/agents/[agentId]/edit/_pages/AgentEditPage";
import getAgent from "@/feature/studio/templates/agents/[agentId]/_api/getAgent";
import getSettings from "@/feature/studio/data/models/_api/getSettings";

async function Page({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params;
  const [agent, settings] = await Promise.all([
    getAgent({ agent_id: Number(agentId) }),
    getSettings(),
  ]);

  return <AgentEditPage agent={agent} settings={settings} />;
}

export default Page;
