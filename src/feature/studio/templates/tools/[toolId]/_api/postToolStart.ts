import { paths } from "@/shared/types/api/tools";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type PostToolStartParams =
  paths["/v1/mcp-tools/{tool_id}:start"]["post"]["parameters"]["path"];

type PostToolStartRequest =
  paths["/v1/mcp-tools/{tool_id}:start"]["post"]["requestBody"]["content"]["application/json"];

type PostToolStartResponse =
  paths["/v1/mcp-tools/{tool_id}:start"]["post"]["responses"]["202"]["content"]["application/json"];

/**
 * MCP 도구 시작 API
 * @param params - 도구 ID를 포함한 파라미터
 * @param data - 도구 시작 요청 데이터
 * @description 중지된 특정 도구를 시작합니다 (비동기 처리).
 */
const postToolStart = async (
  params: PostToolStartParams,
  data: PostToolStartRequest
): Promise<PostToolStartResponse> => {
  try {
    const response = await axiosInstance.tools.post<PostToolStartResponse>(
      `/mcp-tools/${params.tool_id}:start`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default postToolStart;
