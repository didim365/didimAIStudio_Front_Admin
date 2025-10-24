import { paths } from "@/shared/types/api/agents";
import axiosInstance from "@/shared/utils/axiosInstance";

type GetPersonasDataResponse =
  paths["/v1/personas/data"]["get"]["responses"]["200"]["content"]["application/json"];

type GetPersonasDataParams = paths["/v1/personas/data"]["get"]["parameters"]["query"];

const getPersonasData = async (params?: GetPersonasDataParams) => {
  try {
    const response = await axiosInstance.agent.get<GetPersonasDataResponse>(
      "/v1/personas/data",
      { params }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getPersonasData;
