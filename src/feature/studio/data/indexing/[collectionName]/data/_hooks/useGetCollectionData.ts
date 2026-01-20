"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/indexing";
import getCollectionData from "../_api/getCollectionData";

type GetCollectionDataResponse =
  paths["/v1/admin/collections/{collection_name}/data"]["get"]["responses"]["200"]["content"]["application/json"];

type GetCollectionDataParams =
  paths["/v1/admin/collections/{collection_name}/data"]["get"]["parameters"]["path"] &
  paths["/v1/admin/collections/{collection_name}/data"]["get"]["parameters"]["query"];

type GetCollectionDataResponseWithTotalPages = GetCollectionDataResponse & {
  totalPages: number;
};

export const useGetCollectionData = (
  params: GetCollectionDataParams,
  options?: Omit<
    UseQueryOptions<GetCollectionDataResponse, Error, GetCollectionDataResponseWithTotalPages>,
    "queryKey" | "queryFn" | "select"
  >
) => {
  const pageSize = params.page_size || 50;

  return useQuery<GetCollectionDataResponse, Error, GetCollectionDataResponseWithTotalPages>({
    queryKey: ["collectionData", params.collection_name, params],
    queryFn: () => getCollectionData(params),
    select: (data) => ({
      ...data,
      totalPages: Math.ceil(data.total / pageSize),
    }),
    ...options,
  });
};

export default useGetCollectionData;
