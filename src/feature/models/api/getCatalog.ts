import { paths } from "@/shared/types/api/models";
import axiosInstance from "@/shared/utils/axiosInstance";

type GetCatalogResponse =
  paths["/v1/catalog/"]["get"]["responses"]["200"]["content"]["application/json"];

type GetCatalogParams = paths["/v1/catalog/"]["get"]["parameters"]["query"];

const getCatalog = async (params?: GetCatalogParams) => {
  try {
    const response = await axiosInstance.models.get<GetCatalogResponse>(
      "/catalog/",
      { params }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getCatalog;
