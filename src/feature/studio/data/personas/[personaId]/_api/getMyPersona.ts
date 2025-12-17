import { paths, components } from "@/shared/types/api/agents";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
export type GetMyPersonaResponse =
  paths["/v1/personas/my/{my_page_id}"]["get"]["responses"]["200"]["content"]["application/json"];

// PersonaCategoryEnum 타입 export
export type PersonaCategoryEnum = components["schemas"]["PersonaCategoryEnum"];

type GetMyPersonaParams = {
  my_page_id: number;
};

/**
 * 마이페이지 페르소나 데이터 조회 API (서버사이드용)
 * @param params - 마이페이지 페르소나 ID를 포함한 파라미터
 */
const getMyPersona = async (
  params: GetMyPersonaParams
): Promise<GetMyPersonaResponse> => {
  const response = await axiosInstance.agent.get<GetMyPersonaResponse>(
    `/personas/my/${params.my_page_id}`
  );
  return response.data;
};

export default getMyPersona;
