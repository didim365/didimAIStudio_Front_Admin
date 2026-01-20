"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/indexing";
import getMetaCollections from "../_api/getMetaCollections";

type GetMetaCollectionsResponse =
  paths["/v1/admin/collections/{collection_name}/meta-data"]["get"]["responses"]["200"]["content"]["application/json"];

type GetMetaCollectionsParams =
  paths["/v1/admin/collections/{collection_name}/meta-data"]["get"]["parameters"]["path"];

type GetMetaCollectionsQueryParams =
  paths["/v1/admin/collections/{collection_name}/meta-data"]["get"]["parameters"]["query"];

type GetMetaCollectionsResponseWithTotalPages = GetMetaCollectionsResponse & {
  totalPages: number;
};

export const useGetMetaCollections = (
  params: GetMetaCollectionsParams,
  queryParams?: GetMetaCollectionsQueryParams,
  options?: Omit<
    UseQueryOptions<GetMetaCollectionsResponse, Error, GetMetaCollectionsResponseWithTotalPages>,
    "queryKey" | "queryFn" | "select"
  >
) => {
  const pageSize = queryParams?.page_size || 20;

  return useQuery<GetMetaCollectionsResponse, Error, GetMetaCollectionsResponseWithTotalPages>({
    queryKey: ["meta-collections", params.collection_name, queryParams],
    queryFn: () => getMetaCollections(params, queryParams),
    select: (data) => ({
      ...data,
      totalPages: Math.ceil(data.total / pageSize),
    }),
    ...options,
  });
};

export default useGetMetaCollections;
