import { paths } from "@/shared/types/api/models";
import axiosInstance from "@/shared/utils/axiosInstance";

type GetCatalogType =
  paths["/v1/catalog/"]["get"]["responses"]["200"]["content"]["application/json"];

const getCatalog = async () => {
  try {
    const response = await axiosInstance.models.get<GetCatalogType>("/catalog");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getCatalog;
