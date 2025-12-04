import { paths } from "@/shared/types/api/agents";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type PutPersonaResponse =
  paths["/v1/personas/data/{persona_id}"]["put"]["responses"]["200"]["content"]["application/json"];

type PutPersonaParams =
  paths["/v1/personas/data/{persona_id}"]["put"]["parameters"]["path"];

type PutPersonaRequest =
  paths["/v1/personas/data/{persona_id}"]["put"]["requestBody"]["content"]["application/json"];

/**
 * 페르소나 데이터 수정 API (Upsert)
 * @param params - 페르소나 ID를 포함한 파라미터
 * @param data - 페르소나 수정 요청 데이터
 * @description 페르소나 원본 데이터를 수정합니다. 존재하지 않으면 새로 생성합니다.
 */
const putPersona = async (
  params: PutPersonaParams,
  data: PutPersonaRequest
): Promise<PutPersonaResponse> => {
  try {
    const response = await axiosInstance.agent.put<PutPersonaResponse>(
      `/personas/data/${params.persona_id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default putPersona;
