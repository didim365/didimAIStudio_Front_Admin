import axios from "axios";
import { SERVER_API_BASE_URL } from "@/shared/constants";
import { cookies } from "next/headers";
import { paths } from "@/shared/types/api/tools";

// API 타입 추출
export type GetMcpToolResponse =
  paths["/v1/mcp-tools/{tool_id}"]["get"]["responses"]["200"]["content"]["application/json"];

type GetMcpToolParams =
  paths["/v1/mcp-tools/{tool_id}"]["get"]["parameters"]["query"];

type GetMcpToolPathParams = {
  tool_id: number;
};

/**
 * 특정 MCP 도구 조회 API (서버사이드용)
 * @param params - 도구 ID를 포함한 파라미터
 * @param queryParams - 쿼리 파라미터 (선택사항)
 */
const getMcpTool = async (
  params: GetMcpToolPathParams,
  queryParams?: GetMcpToolParams
): Promise<GetMcpToolResponse> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const response = await axios.get<GetMcpToolResponse>(
    `${SERVER_API_BASE_URL}/api/mcp-tools/v1/mcp-tools/${params.tool_id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: queryParams,
    }
  );
  return response.data;
};

export default getMcpTool;
