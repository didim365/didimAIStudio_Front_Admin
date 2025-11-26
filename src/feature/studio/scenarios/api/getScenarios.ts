import { paths } from "@/shared/types/api/agents";
import axiosInstance from "@/shared/utils/axiosInstance";

type GetScenariosResponse =
  paths["/v1/scenarios/data"]["get"]["responses"]["200"]["content"]["application/json"];

type GetScenariosParams =
  paths["/v1/scenarios/data"]["get"]["parameters"]["query"];

const getScenarios = async (params?: GetScenariosParams) => {
  try {
    const response = await axiosInstance.agent.get<GetScenariosResponse>(
      "/scenarios/data",
      { params }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getScenarios;
