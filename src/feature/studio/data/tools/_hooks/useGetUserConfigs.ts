"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/tools";
import getUserConfigs from "../_api/getUserConfigs";

type GetUserConfigsResponse =
  paths["/v1/admin/user-configs"]["get"]["responses"]["200"]["content"]["application/json"];

type GetUserConfigsParams =
  paths["/v1/admin/user-configs"]["get"]["parameters"]["query"];

/**
 * 사용자 설정 조회 훅
 * @param params - 조회 파라미터
 * @param options - 추가 query 옵션 (onSuccess, onError, meta 등)
 * @description 사용자 설정 목록을 조회하는 query 훅입니다.
 */
export const useGetUserConfigs = (
  params?: GetUserConfigsParams,
  options?: Omit<
    UseQueryOptions<GetUserConfigsResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetUserConfigsResponse, Error>({
    queryKey: ["user-configs", params],
    queryFn: () => getUserConfigs(params),
    ...options,
  });
};

export default useGetUserConfigs;

