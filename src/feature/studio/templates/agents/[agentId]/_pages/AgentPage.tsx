import { paths } from "@/shared/types/api/agents";

type GetAgentResponse =
  paths["/v1/agents/data/{agent_id}"]["get"]["responses"]["200"]["content"]["application/json"];

interface AgentPageProps {
  agent: GetAgentResponse;
}

function AgentPage({ agent }: AgentPageProps) {
  return <div>AgentPage</div>;
}

export default AgentPage;
