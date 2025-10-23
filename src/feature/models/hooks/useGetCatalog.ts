import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/models";
import getCatalog from "../api/getCatalog";

type GetCatalogResponse =
  paths["/v1/catalog/"]["get"]["responses"]["200"]["content"]["application/json"];

type GetCatalogParams = paths["/v1/catalog/"]["get"]["parameters"]["query"];

export const useGetCatalog = (
  params?: GetCatalogParams,
  options?: Omit<
    UseQueryOptions<GetCatalogResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetCatalogResponse, Error>({
    queryKey: ["catalog", params],
    queryFn: () => getCatalog(params),
    ...options,
  });
};

export default useGetCatalog;
