import { paths } from "@/shared/types/api/tools";
import axiosInstance from "@/shared/utils/axiosInstance";

type GetMcpToolResponse =
  paths["/v1/mcp-tools/{tool_id}"]["get"]["responses"]["200"]["content"]["application/json"];

type GetMcpToolParams =
  paths["/v1/mcp-tools/{tool_id}"]["get"]["parameters"]["query"];

const getMcpTool = async (toolId: number, params?: GetMcpToolParams) => {
  try {
    const response = await axiosInstance.tools.get<GetMcpToolResponse>(
      `/mcp-tools/${toolId}`,
      {
        params,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getMcpTool;
