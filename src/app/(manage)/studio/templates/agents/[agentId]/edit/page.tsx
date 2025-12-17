import AgentEditPage from "@/feature/studio/templates/agents/[agentId]/edit/_pages/AgentEditPage";
import getAgent from "@/feature/studio/templates/agents/[agentId]/_api/getAgent";
import getSettings from "@/feature/studio/data/models/_api/getSettings";
import getMyPersonas from "@/feature/studio/data/personas/_api/getMyPersonas";

async function Page({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params;
  const [agent, settings, myPersonas] = await Promise.all([
    getAgent({ agent_id: Number(agentId) }),
    getSettings(),
    getMyPersonas(),
  ]);

  return (
    <AgentEditPage agent={agent} settings={settings} myPersonas={myPersonas} />
  );
}

export default Page;
