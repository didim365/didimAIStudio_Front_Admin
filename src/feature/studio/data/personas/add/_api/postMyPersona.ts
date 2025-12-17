import { paths } from "@/shared/types/api/agents";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type PostMyPersonaRequest =
  paths["/v1/personas/my"]["post"]["requestBody"]["content"]["application/json"];

type PostMyPersonaResponse =
  paths["/v1/personas/my"]["post"]["responses"]["201"]["content"]["application/json"];

/**
 * 마이페이지에 페르소나 추가 API
 * @param data - 마이페이지 페르소나 생성 요청 데이터
 * @description 페르소나를 사용자 마이페이지에 추가합니다.
 */
const postMyPersona = async (
  data: PostMyPersonaRequest
): Promise<PostMyPersonaResponse> => {
  try {
    const response = await axiosInstance.agent.post<PostMyPersonaResponse>(
      "/personas/my",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default postMyPersona;
