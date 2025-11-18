import { paths } from "@/shared/types/api/tools";
import axiosInstance from "@/shared/utils/axiosInstance";

type GetMcpToolsResponse =
  paths["/v1/mcp-tools/"]["get"]["responses"]["200"]["content"]["application/json"];

type GetMcpToolsParams = paths["/v1/mcp-tools/"]["get"]["parameters"]["query"];

const getMcpTools = async (params?: GetMcpToolsParams) => {
  try {
    const response = await axiosInstance.tools.get<GetMcpToolsResponse>(
      "/mcp-tools/",
      {
        params,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getMcpTools;
