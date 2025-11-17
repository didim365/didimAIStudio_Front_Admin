import { paths } from "@/shared/types/api/agents";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type PostPersonaRequest =
  paths["/v1/personas/data"]["post"]["requestBody"]["content"]["application/json"];

type PostPersonaResponse =
  paths["/v1/personas/data"]["post"]["responses"]["201"]["content"]["application/json"];

/**
 * 페르소나 데이터 생성 API
 * @param data - 페르소나 생성 요청 데이터
 * @description 새로운 페르소나 원본 데이터를 생성합니다.
 */
const postPersona = async (
  data: PostPersonaRequest
): Promise<PostPersonaResponse> => {
  try {
    const response = await axiosInstance.agent.post<PostPersonaResponse>(
      "/personas/data",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default postPersona;
