import { paths } from "@/shared/types/api/agents";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type PutMyPersonaResponse =
  paths["/v1/personas/my/{my_page_id}"]["put"]["responses"]["200"]["content"]["application/json"];

type PutMyPersonaParams =
  paths["/v1/personas/my/{my_page_id}"]["put"]["parameters"]["path"];

type PutMyPersonaRequest =
  paths["/v1/personas/my/{my_page_id}"]["put"]["requestBody"]["content"]["application/json"];

/**
 * 마이페이지 페르소나 수정 API (Upsert)
 * @param params - 마이페이지 페르소나 ID를 포함한 파라미터
 * @param data - 마이페이지 페르소나 수정 요청 데이터
 * @description 마이페이지 페르소나 항목을 수정합니다. 존재하지 않으면 새로 생성합니다.
 */
const putMyPersona = async (
  params: PutMyPersonaParams,
  data: PutMyPersonaRequest
): Promise<PutMyPersonaResponse> => {
  try {
    const response = await axiosInstance.agent.put<PutMyPersonaResponse>(
      `/personas/my/${params.my_page_id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default putMyPersona;
