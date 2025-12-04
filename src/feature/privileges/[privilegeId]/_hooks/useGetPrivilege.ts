"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import getPrivilege from "../_api/getPrivilege";

type GetPrivilegeResponse =
  paths["/api/v1/roles/privileges/{privilege_id}"]["get"]["responses"]["200"]["content"]["application/json"];

type GetPrivilegeParams =
  paths["/api/v1/roles/privileges/{privilege_id}"]["get"]["parameters"]["path"];

/**
 * 권한 조회 훅
 * @param params - 권한 조회 파라미터 (privilege_id 포함)
 * @param options - 추가 쿼리 옵션 (select, enabled, staleTime 등)
 */
export const useGetPrivilege = (
  params: GetPrivilegeParams,
  options?: Omit<
    UseQueryOptions<GetPrivilegeResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetPrivilegeResponse, Error>({
    queryKey: ["privileges", params.privilege_id],
    queryFn: () => getPrivilege(params),
    ...options,
  });
};

export default useGetPrivilege;
