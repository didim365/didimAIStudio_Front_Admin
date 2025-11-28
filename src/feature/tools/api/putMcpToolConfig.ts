import { paths } from "@/shared/types/api/tools";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type PutMcpToolConfigResponse =
  paths["/v1/mcp-tools/{tool_id}/config"]["put"]["responses"]["200"]["content"]["application/json"];

type PutMcpToolConfigParams =
  paths["/v1/mcp-tools/{tool_id}/config"]["put"]["parameters"]["path"];

type PutMcpToolConfigRequest =
  paths["/v1/mcp-tools/{tool_id}/config"]["put"]["requestBody"]["content"]["application/json"];

/**
 * MCP 도구 설정 업데이트 API
 * @param params - 도구 ID를 포함한 파라미터
 * @param data - 도구 설정 업데이트 요청 데이터
 * @description 특정 도구의 JSON 기반 확장 설정을 업데이트합니다.
 */
const putMcpToolConfig = async (
  params: PutMcpToolConfigParams,
  data: PutMcpToolConfigRequest
): Promise<PutMcpToolConfigResponse> => {
  try {
    const response = await axiosInstance.tools.put<PutMcpToolConfigResponse>(
      `/mcp-tools/${params.tool_id}/config`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default putMcpToolConfig;
