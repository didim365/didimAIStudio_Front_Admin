import { paths } from "@/shared/types/api/indexing";
import axiosInstance from "@/shared/utils/axiosInstance";

type GetCollectionDetailResponse =
  paths["/v1/admin/collections/{collection_name}"]["get"]["responses"]["200"]["content"]["application/json"];

type GetCollectionDetailParams =
  paths["/v1/admin/collections/{collection_name}"]["get"]["parameters"]["path"];

const getCollectionDetail = async (params: GetCollectionDetailParams) => {
  try {
    const response = await axiosInstance.indexing.get<GetCollectionDetailResponse>(
      `/admin/collections/${params.collection_name}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getCollectionDetail;
export type { GetCollectionDetailResponse };
