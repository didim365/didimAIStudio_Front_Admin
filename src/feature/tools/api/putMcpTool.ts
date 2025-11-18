import { paths } from "@/shared/types/api/tools";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type PutMcpToolResponse =
  paths["/v1/mcp-tools/{tool_id}"]["put"]["responses"]["200"]["content"]["application/json"];

type PutMcpToolParams =
  paths["/v1/mcp-tools/{tool_id}"]["put"]["parameters"]["path"];

type PutMcpToolRequest =
  paths["/v1/mcp-tools/{tool_id}"]["put"]["requestBody"]["content"]["application/json"];

/**
 * MCP 도구 수정 API
 * @param params - 도구 ID를 포함한 파라미터
 * @param data - 도구 수정 요청 데이터
 * @description 기존 MCP 도구의 정보를 수정합니다.
 */
const putMcpTool = async (
  params: PutMcpToolParams,
  data: PutMcpToolRequest
): Promise<PutMcpToolResponse> => {
  try {
    const response = await axiosInstance.tools.put<PutMcpToolResponse>(
      `/mcp-tools/${params.tool_id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default putMcpTool;
