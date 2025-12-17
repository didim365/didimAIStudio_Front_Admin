import { paths } from "@/shared/types/api/agents";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type DeleteAgentParams =
  paths["/v1/agents/data/{agent_id}"]["delete"]["parameters"]["path"];

/**
 * 에이전트 삭제 API
 * @param params - 에이전트 ID를 포함한 파라미터
 * @description 에이전트 원본 데이터를 삭제합니다. 관련된 마이페이지 항목들도 함께 삭제됩니다.
 */
const deleteAgent = async (params: DeleteAgentParams): Promise<void> => {
  try {
    await axiosInstance.agent.delete<void>(`/agents/data/${params.agent_id}`);
  } catch (error) {
    throw error;
  }
};

export default deleteAgent;
