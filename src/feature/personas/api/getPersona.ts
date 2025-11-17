import { paths } from "@/shared/types/api/agents";
import axiosInstance from "@/shared/utils/axiosInstance";

type GetPersonaResponse =
  paths["/v1/personas/data/{persona_id}"]["get"]["responses"]["200"]["content"]["application/json"];

type GetPersonaParams =
  paths["/v1/personas/data/{persona_id}"]["get"]["parameters"]["path"];

const getPersona = async (
  params: GetPersonaParams
): Promise<GetPersonaResponse> => {
  try {
    const response = await axiosInstance.agent.get<GetPersonaResponse>(
      `/personas/data/${params.persona_id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getPersona;
