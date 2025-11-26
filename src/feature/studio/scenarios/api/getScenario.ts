import axios from "axios";
import { SERVER_API_BASE_URL } from "@/shared/constants";
import { cookies } from "next/headers";
import { paths } from "@/shared/types/api/agents";

// API 타입 추출
export type GetScenarioResponse =
  paths["/v1/scenarios/data/{scenario_id}"]["get"]["responses"]["200"]["content"]["application/json"];

type GetScenarioParams = {
  scenario_id: number;
};

/**
 * 특정 시나리오 데이터 조회 API (서버사이드용)
 * @param params - 시나리오 ID를 포함한 파라미터
 */
const getScenario = async (
  params: GetScenarioParams
): Promise<GetScenarioResponse> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const response = await axios.get<GetScenarioResponse>(
    `${SERVER_API_BASE_URL}/api/agents/v1/scenarios/data/${params.scenario_id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

export default getScenario;
