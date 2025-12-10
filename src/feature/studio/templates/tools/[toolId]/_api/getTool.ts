import axiosInstance from "@/shared/utils/axiosInstance";
import { cookies } from "next/headers";
import { paths } from "@/shared/types/api/tools";

// API 타입 추출
export type GetToolResponse =
  paths["/v1/mcp-tools/{tool_id}"]["get"]["responses"]["200"]["content"]["application/json"];

type GetToolParams =
  paths["/v1/mcp-tools/{tool_id}"]["get"]["parameters"]["query"];

type GetToolPathParams = {
  tool_id: number;
};

/**
 * 특정 MCP 도구 조회 API (서버사이드용)
 * @param params - 도구 ID를 포함한 파라미터
 * @param queryParams - 쿼리 파라미터 (선택사항)
 */
const getTool = async (
  params: GetToolPathParams,
  queryParams?: GetToolParams
): Promise<GetToolResponse> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const response = await axiosInstance.tools.get<GetToolResponse>(
    `/mcp-tools/${params.tool_id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: queryParams,
    }
  );
  return response.data;
};

export default getTool;
