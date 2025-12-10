import { paths } from "@/shared/types/api/tools";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type PostToolRequest =
  paths["/v1/mcp-tools/"]["post"]["requestBody"]["content"]["application/json"];

type PostToolResponse =
  paths["/v1/mcp-tools/"]["post"]["responses"]["201"]["content"]["application/json"];

/**
 * MCP 도구 등록 API
 * @param data - 도구 생성 요청 데이터
 * @description 새로운 MCP 도구를 등록합니다.
 */
const postTool = async (
  data: PostToolRequest
): Promise<PostToolResponse> => {
  try {
    const response = await axiosInstance.tools.post<PostToolResponse>(
      "/mcp-tools/",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default postTool;
