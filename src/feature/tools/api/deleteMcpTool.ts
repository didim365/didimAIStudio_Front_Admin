import { paths } from "@/shared/types/api/tools";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type DeleteMcpToolParams =
  paths["/v1/mcp-tools/{tool_id}"]["delete"]["parameters"]["path"];

/**
 * MCP 도구 삭제 API
 * @param params - 도구 ID를 포함한 파라미터
 * @description 기존 MCP 도구를 순차적으로 삭제합니다.
 */
const deleteMcpTool = async (params: DeleteMcpToolParams): Promise<void> => {
  try {
    await axiosInstance.tools.delete(`/mcp-tools/${params.tool_id}`);
  } catch (error) {
    throw error;
  }
};

export default deleteMcpTool;
