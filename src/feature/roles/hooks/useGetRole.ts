"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import getRole from "../api/getRole";

type GetRoleResponse =
  paths["/api/v1/roles/{role_id}"]["get"]["responses"]["200"]["content"]["application/json"];

type GetRoleParams =
  paths["/api/v1/roles/{role_id}"]["get"]["parameters"]["path"];

/**
 * 역할 조회 훅
 * @param params - 역할 조회 파라미터 (role_id 포함)
 * @param options - 추가 쿼리 옵션 (select, enabled, staleTime 등)
 */
export const useGetRole = (
  params: GetRoleParams,
  options?: Omit<
    UseQueryOptions<GetRoleResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetRoleResponse, Error>({
    queryKey: ["roles", params.role_id],
    queryFn: () => getRole(params.role_id),
    ...options,
  });
};

export default useGetRole;
