import { paths } from "@/shared/types/api/indexing";
import axiosInstance from "@/shared/utils/axiosInstance";

type GetCollectionDataResponse =
  paths["/v1/admin/collections/{collection_name}/data"]["get"]["responses"]["200"]["content"]["application/json"];

type GetCollectionDataParams =
  paths["/v1/admin/collections/{collection_name}/data"]["get"]["parameters"]["path"] &
  paths["/v1/admin/collections/{collection_name}/data"]["get"]["parameters"]["query"];

const getCollectionData = async (params: GetCollectionDataParams) => {
  try {
    const { collection_name, ...queryParams } = params;
    const response = await axiosInstance.indexing.get<GetCollectionDataResponse>(
      `/admin/collections/${collection_name}/data`,
      { params: queryParams }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getCollectionData;
export type { GetCollectionDataResponse, GetCollectionDataParams };
