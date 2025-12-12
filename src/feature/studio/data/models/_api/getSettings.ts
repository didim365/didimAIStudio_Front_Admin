import { paths } from "@/shared/types/api/models";
import axiosInstance from "@/shared/utils/axiosInstance";

export type GetSettingsResponse =
  paths["/v1/settings"]["get"]["responses"]["200"]["content"]["application/json"];

type GetSettingsParams = paths["/v1/settings"]["get"]["parameters"]["query"];

const getSettings = async (params?: GetSettingsParams) => {
  try {
    const response = await axiosInstance.models.get<GetSettingsResponse>(
      "/settings",
      { params }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getSettings;
