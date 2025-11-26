import { paths } from "@/shared/types/api/agents";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type DeleteScenarioParams =
  paths["/v1/scenarios/data/{scenario_id}"]["delete"]["parameters"]["path"];

/**
 * 시나리오 삭제 API
 * @param params - 시나리오 ID를 포함한 파라미터
 * @description 시나리오 원본 데이터를 삭제합니다.
 */
const deleteScenario = async (params: DeleteScenarioParams): Promise<void> => {
  try {
    await axiosInstance.agent.delete<void>(
      `/scenarios/data/${params.scenario_id}`
    );
  } catch (error) {
    throw error;
  }
};

export default deleteScenario;
