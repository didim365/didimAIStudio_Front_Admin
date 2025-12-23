"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/tools";
import getContainers from "../_api/getContainers";

type GetContainersResponse =
  paths["/v1/admin/containers"]["get"]["responses"]["200"]["content"]["application/json"];

type GetContainersParams =
  paths["/v1/admin/containers"]["get"]["parameters"]["query"];

/**
 * 컨테이너 조회 훅
 * @param options - 추가 mutation 옵션 (onSuccess, onError, meta 등)
 * @description 컨테이너 목록을 조회하는 mutation 훅입니다.
 */
export const useGetContainers = (
  options?: Omit<
    UseMutationOptions<
      GetContainersResponse,
      Error,
      GetContainersParams | undefined
    >,
    "mutationFn"
  >
) => {
  return useMutation<
    GetContainersResponse,
    Error,
    GetContainersParams | undefined
  >({
    mutationFn: (params?: GetContainersParams) => getContainers(params),
    ...options,
  });
};

export default useGetContainers;
