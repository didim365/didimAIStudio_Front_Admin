import { paths } from "@/shared/types/api/agents";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type PutAgentResponse =
  paths["/v1/agents/data/{agent_id}"]["put"]["responses"]["200"]["content"]["application/json"];

type PutAgentParams =
  paths["/v1/agents/data/{agent_id}"]["put"]["parameters"]["path"];

type PutAgentRequest =
  paths["/v1/agents/data/{agent_id}"]["put"]["requestBody"]["content"]["application/json"];

/**
 * 에이전트 데이터 수정 API (Upsert)
 * @param params - 에이전트 ID를 포함한 파라미터
 * @param data - 에이전트 수정 요청 데이터
 * @description 에이전트 원본 데이터를 수정합니다. 존재하지 않으면 새로 생성합니다.
 */
const putAgent = async (
  params: PutAgentParams,
  data: PutAgentRequest
): Promise<PutAgentResponse> => {
  try {
    const response = await axiosInstance.agent.put<PutAgentResponse>(
      `/agents/data/${params.agent_id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default putAgent;
