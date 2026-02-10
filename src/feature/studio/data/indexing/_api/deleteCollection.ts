import { paths } from "@/shared/types/api/indexing";
import axiosInstance from "@/shared/utils/axiosInstance";

type DeleteCollectionRequest =
  paths["/v1/admin/collections/data"]["delete"]["requestBody"]["content"]["application/json"];

type DeleteCollectionResponse =
  paths["/v1/admin/collections/data"]["delete"]["responses"]["200"]["content"]["application/json"];

const deleteCollection = async (data: DeleteCollectionRequest) => {
  try {
    const response = await axiosInstance.indexing.delete<DeleteCollectionResponse>(
      "/admin/collections/data",
      { data }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default deleteCollection;
