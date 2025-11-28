import { paths } from "@/shared/types/api/agents";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
export type GetScenarioResponse =
  paths["/v1/scenarios/data/{scenario_id}"]["get"]["responses"]["200"]["content"]["application/json"];

type GetScenarioParams =
  paths["/v1/scenarios/data/{scenario_id}"]["get"]["parameters"]["path"];

/**
 * 특정 시나리오 데이터 조회 API
 * @param params - 시나리오 ID를 포함한 파라미터
 */
const getScenario = async (
  params: GetScenarioParams
): Promise<GetScenarioResponse> => {
  try {
    const response = await axiosInstance.agent.get<GetScenarioResponse>(
      `/scenarios/data/${params.scenario_id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getScenario;
