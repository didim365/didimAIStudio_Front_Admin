"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import getGroupMembers from "../_api/getGroupMembers";

type GetGroupMembersResponse =
  paths["/api/v1/groups/{group_id}/members"]["get"]["responses"]["200"]["content"]["application/json"];

type GetGroupMembersPathParams =
  paths["/api/v1/groups/{group_id}/members"]["get"]["parameters"]["path"];

type GetGroupMembersQueryParams =
  paths["/api/v1/groups/{group_id}/members"]["get"]["parameters"]["query"];

type GetGroupMembersParams = GetGroupMembersPathParams &
  Partial<NonNullable<GetGroupMembersQueryParams>>;

/**
 * 그룹 멤버 목록 조회 훅
 * @param params - 그룹 ID 및 페이지네이션 파라미터
 * @param options - 추가 쿼리 옵션 (select, enabled, staleTime 등)
 */
export const useGetGroupMembers = <TData = GetGroupMembersResponse>(
  params: GetGroupMembersParams,
  options?: Omit<
    UseQueryOptions<GetGroupMembersResponse, Error, TData>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetGroupMembersResponse, Error, TData>({
    queryKey: ["groups", params.group_id, "members", params],
    queryFn: () =>
      getGroupMembers(
        params as GetGroupMembersPathParams &
          NonNullable<GetGroupMembersQueryParams>
      ),
    ...options,
  });
};

export default useGetGroupMembers;
