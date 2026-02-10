import { paths } from "@/shared/types/api/indexing";
import axiosInstance from "@/shared/utils/axiosInstance";

export type GetVectorDataResponse =
  paths["/v1/admin/collections/{collection_name}/vector"]["get"]["responses"]["200"]["content"]["application/json"];

type GetVectorDataParams =
  paths["/v1/admin/collections/{collection_name}/vector"]["get"]["parameters"]["path"];

type GetVectorDataQueryParams =
  paths["/v1/admin/collections/{collection_name}/vector"]["get"]["parameters"]["query"];

const getVectorData = async (
  params: GetVectorDataParams,
  queryParams?: GetVectorDataQueryParams
) => {
  try {
    const response = await axiosInstance.indexing.get<GetVectorDataResponse>(
      `/admin/collections/${params.collection_name}/vector`,
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
