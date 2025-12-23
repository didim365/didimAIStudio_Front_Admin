"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/models";
import getPrivateModels from "../_api/getPrivateModels";

type GetPrivateModelsResponse =
  paths["/v1/models/deployed"]["get"]["responses"]["200"]["content"]["application/json"];

/**
 * 배포된 모델 목록 조회 훅
 * @param options - 추가 쿼리 옵션 (select, enabled, staleTime 등)
 */
export const useGetPrivateModels = (
  options?: Omit<
    UseQueryOptions<GetPrivateModelsResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetPrivateModelsResponse, Error>({
    queryKey: ["models", "deployed"],
    queryFn: getPrivateModels,
    ...options,
  });
};

export default useGetPrivateModels;
