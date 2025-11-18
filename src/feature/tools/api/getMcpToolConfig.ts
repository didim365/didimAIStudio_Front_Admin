import { paths } from "@/shared/types/api/tools";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type GetMcpToolConfigParams =
  paths["/v1/mcp-tools/{tool_id}/config"]["get"]["parameters"]["path"];

type GetMcpToolConfigResponse =
  paths["/v1/mcp-tools/{tool_id}/config"]["get"]["responses"]["200"]["content"]["application/json"];

/**
 * MCP 도구 설정 조회 API
 * @param params - 도구 ID를 포함한 파라미터
 * @description 특정 도구의 템플릿(공용) 설정을 조회합니다.
 */
const getMcpToolConfig = async (
  params: GetMcpToolConfigParams
): Promise<GetMcpToolConfigResponse> => {
  try {
    const response = await axiosInstance.tools.get<GetMcpToolConfigResponse>(
      `/mcp-tools/${params.tool_id}/config`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getMcpToolConfig;
