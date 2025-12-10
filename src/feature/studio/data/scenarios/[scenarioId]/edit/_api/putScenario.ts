import { paths } from "@/shared/types/api/agents";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type PutScenarioParams =
  paths["/v1/scenarios/data/{scenario_id}"]["put"]["parameters"]["path"];

type PutScenarioBody =
  paths["/v1/scenarios/data/{scenario_id}"]["put"]["requestBody"]["content"]["application/json"];

type PutScenarioResponse =
  paths["/v1/scenarios/data/{scenario_id}"]["put"]["responses"]["200"]["content"]["application/json"];

/**
 * 시나리오 수정 API
 * @param params - 시나리오 ID를 포함한 파라미터
 * @param body - 수정할 시나리오 데이터
 * @description 시나리오 데이터를 수정합니다.
 */
const putScenario = async (
  params: PutScenarioParams,
  body: PutScenarioBody
): Promise<PutScenarioResponse> => {
  try {
    const response = await axiosInstance.agent.put<PutScenarioResponse>(
      `/scenarios/data/${params.scenario_id}`,
      body
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default putScenario;
