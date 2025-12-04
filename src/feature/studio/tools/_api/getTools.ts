import { paths } from "@/shared/types/api/tools";
import axiosInstance from "@/shared/utils/axiosInstance";

type GetToolsResponse =
  paths["/v1/mcp-tools/"]["get"]["responses"]["200"]["content"]["application/json"];

type GetToolsParams = paths["/v1/mcp-tools/"]["get"]["parameters"]["query"];

const getTools = async (params?: GetToolsParams) => {
  try {
    const response = await axiosInstance.tools.get<GetToolsResponse>(
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

export default getTools;
