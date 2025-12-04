import { paths } from "@/shared/types/api/agents";
import axiosInstance from "@/shared/utils/axiosInstance";

type GetPersonasResponse =
  paths["/v1/personas/data"]["get"]["responses"]["200"]["content"]["application/json"];

type GetPersonasParams =
  paths["/v1/personas/data"]["get"]["parameters"]["query"];

const getPersonas = async (params?: GetPersonasParams) => {
  try {
    const response = await axiosInstance.agent.get<GetPersonasResponse>(
      "/personas/data",
      { params }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getPersonas;
