"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import getRolePrivileges from "../_api/getRolePrivileges";

type GetRolePrivilegesResponse =
  paths["/api/v1/roles/{role_id}/privileges"]["get"]["responses"]["200"]["content"]["application/json"];

type GetRolePrivilegesParams =
  paths["/api/v1/roles/{role_id}/privileges"]["get"]["parameters"]["path"];

/**
 * 역할의 권한 조회 훅
 * @param params - 역할 권한 조회 파라미터 (role_id 포함)
 * @param options - 추가 쿼리 옵션 (select, enabled, staleTime 등)
 */
export const useGetRolePrivileges = (
  params: GetRolePrivilegesParams,
  options?: Omit<
    UseQueryOptions<GetRolePrivilegesResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetRolePrivilegesResponse, Error>({
    queryKey: ["roles", params.role_id, "privileges"],
    queryFn: () => getRolePrivileges(params.role_id),
    ...options,
  });
};

export default useGetRolePrivileges;
