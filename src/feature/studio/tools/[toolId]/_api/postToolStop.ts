import { paths } from "@/shared/types/api/tools";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type PostToolStopParams =
  paths["/v1/mcp-tools/{tool_id}:stop"]["post"]["parameters"]["path"];

type PostToolStopRequest =
  paths["/v1/mcp-tools/{tool_id}:stop"]["post"]["requestBody"]["content"]["application/json"];

type PostToolStopResponse =
  paths["/v1/mcp-tools/{tool_id}:stop"]["post"]["responses"]["202"]["content"]["application/json"];

/**
 * MCP 도구 중지 API
 * @param params - 도구 ID를 포함한 파라미터
 * @param data - 도구 중지 요청 데이터
 * @description 특정 도구를 중지합니다 (비동기 처리).
 */
const postToolStop = async (
  params: PostToolStopParams,
  data: PostToolStopRequest
): Promise<PostToolStopResponse> => {
  try {
    const response = await axiosInstance.tools.post<PostToolStopResponse>(
      `/mcp-tools/${params.tool_id}:stop`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default postToolStop;
