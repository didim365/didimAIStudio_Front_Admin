"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import getGroupRoles from "../api/getGroupRoles";

type GetGroupRolesResponse =
  paths["/api/v1/roles/groups/{group_id}/roles"]["get"]["responses"]["200"]["content"]["application/json"];

type GetGroupRolesParams =
  paths["/api/v1/roles/groups/{group_id}/roles"]["get"]["parameters"]["path"];

/**
 * 그룹의 역할 조회 훅
 * @param params - 그룹 ID를 포함한 파라미터
 * @param options - 추가 쿼리 옵션 (select, enabled, staleTime 등)
 */
export const useGetGroupRoles = (
  params: GetGroupRolesParams,
  options?: Omit<
    UseQueryOptions<GetGroupRolesResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetGroupRolesResponse, Error>({
    queryKey: ["groups", params.group_id, "roles"],
    queryFn: () => getGroupRoles(params),
    ...options,
  });
};

export default useGetGroupRoles;
