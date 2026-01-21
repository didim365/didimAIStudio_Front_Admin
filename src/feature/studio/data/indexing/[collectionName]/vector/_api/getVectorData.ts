import { paths } from "@/shared/types/api/indexing";
import axiosInstance from "@/shared/utils/axiosInstance";

type GetVectorDataResponse =
  paths["/v1/admin/collections/{collection_name}/vector-data"]["get"]["responses"]["200"]["content"]["application/json"];

type GetVectorDataParams =
  paths["/v1/admin/collections/{collection_name}/vector-data"]["get"]["parameters"]["path"];

type GetVectorDataQueryParams =
  paths["/v1/admin/collections/{collection_name}/vector-data"]["get"]["parameters"]["query"];

const getVectorData = async (
  params: GetVectorDataParams,
  queryParams?: GetVectorDataQueryParams
) => {
  try {
    const response = await axiosInstance.indexing.get<GetVectorDataResponse>(
      `/admin/collections/${params.collection_name}/vector-data`,
      {
        params: queryParams,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getVectorData;
export type { GetVectorDataResponse };
