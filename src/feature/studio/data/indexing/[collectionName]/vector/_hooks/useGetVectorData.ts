"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/indexing";
import getVectorData from "../_api/getVectorData";

type GetVectorDataResponse =
  paths["/v1/admin/collections/{collection_name}/vector-data"]["get"]["responses"]["200"]["content"]["application/json"];

type GetVectorDataParams =
  paths["/v1/admin/collections/{collection_name}/vector-data"]["get"]["parameters"]["path"];

type GetVectorDataQueryParams =
  paths["/v1/admin/collections/{collection_name}/vector-data"]["get"]["parameters"]["query"];

type GetVectorDataResponseWithTotalPages = GetVectorDataResponse & {
  totalPages: number;
};

export const useGetVectorData = (
  params: GetVectorDataParams,
  queryParams?: GetVectorDataQueryParams,
  options?: Omit<
    UseQueryOptions<GetVectorDataResponse, Error, GetVectorDataResponseWithTotalPages>,
    "queryKey" | "queryFn" | "select"
  >
) => {
  const pageSize = queryParams?.page_size || 50;

  return useQuery<GetVectorDataResponse, Error, GetVectorDataResponseWithTotalPages>({
    queryKey: ["vector-data", params.collection_name, queryParams],
    queryFn: () => getVectorData(params, queryParams),
    select: (data) => ({
      ...data,
      totalPages: Math.ceil(data.total / pageSize),
    }),
    ...options,
  });
};

export default useGetVectorData;
