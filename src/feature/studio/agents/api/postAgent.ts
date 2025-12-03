import { paths } from "@/shared/types/api/agents";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type PostAgentRequest =
  paths["/v1/agents/data"]["post"]["requestBody"]["content"]["application/json"];

type PostAgentResponse =
  paths["/v1/agents/data"]["post"]["responses"]["201"]["content"]["application/json"];

/**
 * 에이전트 데이터 생성 API
 * @param data - 에이전트 생성 요청 데이터
 * @description 새로운 에이전트 원본 데이터를 생성합니다.
 */
const postAgent = async (
  data: PostAgentRequest
): Promise<PostAgentResponse> => {
  try {
    const response = await axiosInstance.agent.post<PostAgentResponse>(
      "/agents/data",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default postAgent;
