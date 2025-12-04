"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import getRoles from "../_api/getRoles";

type GetRolesResponse =
  paths["/api/v1/roles/"]["get"]["responses"]["200"]["content"]["application/json"];

/**
 * 모든 역할 조회 훅
 * 모든 역할 조회 (역할은 Admin, manager, user 등으로 정책에 따라 설정할 수 있다.)
 * @param options - 추가 쿼리 옵션 (select, enabled, staleTime 등)
 */
export const useGetRoles = (
  options?: Omit<
    UseQueryOptions<GetRolesResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetRolesResponse, Error>({
    queryKey: ["roles"],
    queryFn: getRoles,
    ...options,
  });
};

export default useGetRoles;
