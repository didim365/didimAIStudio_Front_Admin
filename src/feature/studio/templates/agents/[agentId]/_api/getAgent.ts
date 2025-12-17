import { paths } from "@/shared/types/api/agents";
import axiosInstance from "@/shared/utils/axiosInstance";

type GetAgentResponse =
  paths["/v1/agents/data/{agent_id}"]["get"]["responses"]["200"]["content"]["application/json"];

type GetAgentParams =
  paths["/v1/agents/data/{agent_id}"]["get"]["parameters"]["path"];

const getAgent = async (params: GetAgentParams): Promise<GetAgentResponse> => {
  try {
    const response = await axiosInstance.agent.get<GetAgentResponse>(
      `/agents/data/${params.agent_id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getAgent;
