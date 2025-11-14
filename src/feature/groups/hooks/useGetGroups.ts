"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import getGroups from "../api/getGroups";

type GetGroupsResponse =
  paths["/api/v1/groups"]["get"]["responses"]["200"]["content"]["application/json"];

type GetGroupsParams = paths["/api/v1/groups"]["get"]["parameters"]["query"];

/**
 * 그룹 목록 조회 훅
 * @param params - 조회 파라미터
 * @param options - 추가 쿼리 옵션 (select, enabled, staleTime 등)
 */
export const useGetGroups = <TData = GetGroupsResponse>(
  params?: GetGroupsParams,
  options?: Omit<
    UseQueryOptions<GetGroupsResponse, Error, TData>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetGroupsResponse, Error, TData>({
    queryKey: ["groups", params],
    queryFn: () => getGroups(params),
    ...options,
  });
};

export default useGetGroups;
