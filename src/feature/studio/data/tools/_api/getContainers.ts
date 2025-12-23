import { paths } from "@/shared/types/api/tools";
import axiosInstance from "@/shared/utils/axiosInstance";

type GetContainersResponse =
  paths["/v1/admin/containers"]["get"]["responses"]["200"]["content"]["application/json"];

type GetContainersParams =
  paths["/v1/admin/containers"]["get"]["parameters"]["query"];

const getContainers = async (params?: GetContainersParams) => {
  try {
    const response = await axiosInstance.tools.get<GetContainersResponse>(
      "/admin/containers",
      {
        params,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getContainers;
