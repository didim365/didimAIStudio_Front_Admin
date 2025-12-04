import { paths } from "@/shared/types/api/tools";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type PostDeployToolParams =
  paths["/v1/mcp-tools/{tool_id}:deploy"]["post"]["parameters"]["path"];

type PostDeployToolRequest =
  paths["/v1/mcp-tools/{tool_id}:deploy"]["post"]["requestBody"]["content"]["application/json"];

type PostDeployToolResponse =
  paths["/v1/mcp-tools/{tool_id}:deploy"]["post"]["responses"]["202"]["content"]["application/json"];

/**
 * MCP 도구 배포 API (레거시)
 * @param params - 도구 ID를 포함한 파라미터
 * @param data - 도구 배포 요청 데이터
 * @description 특정 도구를 배포합니다 (비동기 처리).
 *              ⚠️ 레거시 API: 이 엔드포인트는 하위 호환성을 위해 유지됩니다.
 *              새로운 멀티유저 환경에서는 admin 사용자의 'default' 설정으로 자동 처리됩니다.
 */
const postDeployTool = async (
  params: PostDeployToolParams,
  data: PostDeployToolRequest
): Promise<PostDeployToolResponse> => {
  try {
    const response = await axiosInstance.tools.post<PostDeployToolResponse>(
      `/mcp-tools/${params.tool_id}:deploy`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default postDeployTool;
