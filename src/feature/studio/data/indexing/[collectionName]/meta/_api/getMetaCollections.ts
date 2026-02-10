import { paths } from "@/shared/types/api/indexing";
import axiosInstance from "@/shared/utils/axiosInstance";

type GetMetaCollectionsResponse =
  paths["/v1/admin/collections/{collection_name}/meta"]["get"]["responses"]["200"]["content"]["application/json"];

type GetMetaCollectionsParams =
  paths["/v1/admin/collections/{collection_name}/meta"]["get"]["parameters"]["path"];

type GetMetaCollectionsQueryParams =
  paths["/v1/admin/collections/{collection_name}/meta"]["get"]["parameters"]["query"];

const getMetaCollections = async (
  params: GetMetaCollectionsParams,
  queryParams?: GetMetaCollectionsQueryParams
) => {
  try {
    const response = await axiosInstance.indexing.get<GetMetaCollectionsResponse>(
      `/admin/collections/${params.collection_name}/meta`,
      {
        params: queryParams,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getMetaCollections;
export type { GetMetaCollectionsResponse };
