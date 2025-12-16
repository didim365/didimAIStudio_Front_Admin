import { paths } from "@/shared/types/api/indexing";
import axiosInstance from "@/shared/utils/axiosInstance";

type GetCategoriesResponse =
  paths["/v1/documents/categories"]["get"]["responses"]["200"]["content"]["application/json"];

const getCategories = async () => {
  try {
    const response = await axiosInstance.indexing.get<GetCategoriesResponse>(
      "/documents/categories"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getCategories;
