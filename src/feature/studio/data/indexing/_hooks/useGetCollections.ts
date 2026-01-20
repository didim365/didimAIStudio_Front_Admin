"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/indexing";
import getCollections from "../_api/getCollections";

type GetCollectionsResponse =
  paths["/v1/admin/collections"]["get"]["responses"]["200"]["content"]["application/json"];

type GetCollectionsParams =
  paths["/v1/admin/collections"]["get"]["parameters"]["query"];

export const useGetCollections = (
  params?: GetCollectionsParams,
  options?: Omit<
    UseQueryOptions<GetCollectionsResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetCollectionsResponse, Error>({
    queryKey: ["collections", params],
    queryFn: () => getCollections(params),
    ...options,
  });
};

export default useGetCollections;
