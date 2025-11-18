import axios from "axios";
import { SERVER_API_BASE_URL } from "@/shared/constants";
import { cookies } from "next/headers";
import { paths } from "@/shared/types/api/agents";

// API 타입 추출
export type GetPersonaResponse =
  paths["/v1/personas/data/{persona_id}"]["get"]["responses"]["200"]["content"]["application/json"];

type GetPersonaParams = {
  persona_id: number;
};

/**
 * 특정 페르소나 데이터 조회 API (서버사이드용)
 * @param params - 페르소나 ID를 포함한 파라미터
 */
const getPersona = async (
  params: GetPersonaParams
): Promise<GetPersonaResponse> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const response = await axios.get<GetPersonaResponse>(
    `${SERVER_API_BASE_URL}/api/agents/v1/personas/data/${params.persona_id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

export default getPersona;
