import { paths } from "@/shared/types/api/tools";
import axiosInstance from "@/shared/utils/axiosInstance";

type GetUserConfigsResponse =
  paths["/v1/admin/user-configs"]["get"]["responses"]["200"]["content"]["application/json"];

type GetUserConfigsParams =
  paths["/v1/admin/user-configs"]["get"]["parameters"]["query"];

const getUserConfigs = async (params?: GetUserConfigsParams) => {
  try {
    const response = await axiosInstance.tools.get<GetUserConfigsResponse>(
      "/admin/user-configs",
      {
        params,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getUserConfigs;

