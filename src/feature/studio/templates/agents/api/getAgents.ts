import { paths } from "@/shared/types/api/agents";
import axiosInstance from "@/shared/utils/axiosInstance";

type GetAgentsResponse =
  paths["/v1/agents/data"]["get"]["responses"]["200"]["content"]["application/json"];

type GetAgentsParams = paths["/v1/agents/data"]["get"]["parameters"]["query"];

const getAgents = async (params?: GetAgentsParams) => {
  try {
    const response = await axiosInstance.agent.get<GetAgentsResponse>(
      "/agents/data",
      { params }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getAgents;
