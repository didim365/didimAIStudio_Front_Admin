"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import getPrivileges from "../_api/getPrivileges";

type GetPrivilegesResponse =
  paths["/api/v1/roles/privileges/all"]["get"]["responses"]["200"]["content"]["application/json"];

/**
 * 모든 권한 조회 훅
 * @description 모든 권한을 조회합니다.
 * @param options - 추가 쿼리 옵션 (select, enabled, staleTime 등)
 */
export const useGetPrivileges = (
  options?: Omit<
    UseQueryOptions<GetPrivilegesResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetPrivilegesResponse, Error>({
    queryKey: ["privileges", "all"],
    queryFn: getPrivileges,
    ...options,
  });
};

export default useGetPrivileges;
