import { paths } from "@/shared/types/api/models";
import axiosInstance from "@/shared/utils/axiosInstance";

type GetConfigParams =
  paths["/v1/settings/config/{user_model_id}"]["get"]["parameters"]["path"];

export type GetConfigResponse =
  paths["/v1/settings/config/{user_model_id}"]["get"]["responses"]["200"]["content"]["application/json"];

const getConfig = async (
  params: GetConfigParams
): Promise<GetConfigResponse> => {
  try {
    const response = await axiosInstance.models.get<GetConfigResponse>(
      `/settings/config/${params.user_model_id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getConfig;
