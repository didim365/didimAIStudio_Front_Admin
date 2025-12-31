import { paths } from "@/shared/types/api/tools";
import axiosInstance from "@/shared/utils/axiosInstance";

export type GetUserConfigResponse =
  paths["/v1/admin/user-configs/{config_id}"]["get"]["responses"]["200"]["content"]["application/json"];

type GetUserConfigParams =
  paths["/v1/admin/user-configs/{config_id}"]["get"]["parameters"]["path"];

const getUserConfig = async (params: GetUserConfigParams) => {
  try {
    const response = await axiosInstance.tools.get<GetUserConfigResponse>(
      `/admin/user-configs/${params.config_id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getUserConfig;
