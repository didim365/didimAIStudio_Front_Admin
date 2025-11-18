import { paths } from "@/shared/types/api/tools";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type PostMcpToolRequest =
  paths["/v1/mcp-tools/"]["post"]["requestBody"]["content"]["application/json"];

type PostMcpToolResponse =
  paths["/v1/mcp-tools/"]["post"]["responses"]["201"]["content"]["application/json"];

/**
 * MCP 도구 등록 API
 * @param data - 도구 생성 요청 데이터
 * @description 새로운 MCP 도구를 등록합니다.
 */
const postMcpTool = async (
  data: PostMcpToolRequest
): Promise<PostMcpToolResponse> => {
  try {
    const response = await axiosInstance.tools.post<PostMcpToolResponse>(
      "/mcp-tools/",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default postMcpTool;
