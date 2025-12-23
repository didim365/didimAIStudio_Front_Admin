"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/tools";
import getContainers from "../_api/getContainers";

type GetContainersResponse =
  paths["/v1/admin/containers"]["get"]["responses"]["200"]["content"]["application/json"];

type GetContainersParams =
  paths["/v1/admin/containers"]["get"]["parameters"]["query"];

/**
 * 컨테이너 조회 훅
 * @param params - 조회 파라미터
 * @param options - 추가 query 옵션 (onSuccess, onError, meta 등)
 * @description 컨테이너 목록을 조회하는 query 훅입니다.
 */
export const useGetContainers = (
  params?: GetContainersParams,
  options?: Omit<
    UseQueryOptions<GetContainersResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetContainersResponse, Error>({
    queryKey: ["containers", params],
    queryFn: () => getContainers(params),
    ...options,
  });
};

export default useGetContainers;
