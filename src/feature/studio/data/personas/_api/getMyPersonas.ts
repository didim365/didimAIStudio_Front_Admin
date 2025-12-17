import { paths } from "@/shared/types/api/agents";
import axiosInstance from "@/shared/utils/axiosInstance";

export type GetMyPersonasResponse =
  paths["/v1/personas/my"]["get"]["responses"]["200"]["content"]["application/json"];

type GetMyPersonasParams =
  paths["/v1/personas/my"]["get"]["parameters"]["query"];

const getMyPersonas = async (params?: GetMyPersonasParams) => {
  try {
    const response = await axiosInstance.agent.get<GetMyPersonasResponse>(
      "/personas/my",
      { params }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getMyPersonas;
