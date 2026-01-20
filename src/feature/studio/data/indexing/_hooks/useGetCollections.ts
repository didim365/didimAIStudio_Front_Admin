"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/indexing";
import getCollections from "../_api/getCollections";

type GetCollectionsResponse =
  paths["/v1/admin/collections"]["get"]["responses"]["200"]["content"]["application/json"];

type GetCollectionsParams =
  paths["/v1/admin/collections"]["get"]["parameters"]["query"];

type GetCollectionsResponseWithTotalPages = GetCollectionsResponse & {
  totalPages: number;
};

export const useGetCollections = (
  params?: GetCollectionsParams,
  options?: Omit<
    UseQueryOptions<GetCollectionsResponse, Error, GetCollectionsResponseWithTotalPages>,
    "queryKey" | "queryFn" | "select"
  >
) => {
  const pageSize = params?.page_size || 20;

  return useQuery<GetCollectionsResponse, Error, GetCollectionsResponseWithTotalPages>({
    queryKey: ["collections", params],
    queryFn: () => getCollections(params),
    select: (data) => ({
      ...data,
      totalPages: Math.ceil(data.total / pageSize),
    }),
    ...options,
  });
};

export default useGetCollections;
