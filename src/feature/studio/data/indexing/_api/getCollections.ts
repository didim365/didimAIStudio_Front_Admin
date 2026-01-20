import { paths } from "@/shared/types/api/indexing";
import axiosInstance from "@/shared/utils/axiosInstance";

type GetCollectionsResponse =
  paths["/v1/admin/collections"]["get"]["responses"]["200"]["content"]["application/json"];

type GetCollectionsParams =
  paths["/v1/admin/collections"]["get"]["parameters"]["query"];

const getCollections = async (params?: GetCollectionsParams) => {
  try {
    const response = await axiosInstance.indexing.get<GetCollectionsResponse>(
      "/admin/collections",
      { params }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getCollections;
