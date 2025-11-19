import { paths } from "@/shared/types/api/agents";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
export type GetPersonaResponse =
  paths["/v1/personas/data/{persona_id}"]["get"]["responses"]["200"]["content"]["application/json"];

type GetPersonaParams = {
  persona_id: number;
};

/**
 * 특정 페르소나 데이터 조회 API (서버사이드용)
 * @param params - 페르소나 ID를 포함한 파라미터
 */
const getPersona = async (
  params: GetPersonaParams
): Promise<GetPersonaResponse> => {
  const response = await axiosInstance.agent.get<GetPersonaResponse>(
    `/personas/data/${params.persona_id}`
  );
  return response.data;
};

export default getPersona;
