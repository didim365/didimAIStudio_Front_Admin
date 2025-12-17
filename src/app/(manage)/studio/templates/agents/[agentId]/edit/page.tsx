import AgentEditPage from "@/feature/studio/templates/agents/[agentId]/edit/_pages/AgentEditPage";
import getAgent from "@/feature/studio/templates/agents/[agentId]/_api/getAgent";
import getSettings from "@/feature/studio/data/models/_api/getSettings";
import getPersonas from "@/feature/studio/data/personas/_api/getPersonas";

async function Page({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params;
  const [agent, settings, personas] = await Promise.all([
    getAgent({ agent_id: Number(agentId) }),
    getSettings(),
    getPersonas(),
  ]);

  return (
    <AgentEditPage agent={agent} settings={settings} personas={personas} />
  );
}

export default Page;
