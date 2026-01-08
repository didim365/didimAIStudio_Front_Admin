"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/models";
import getLocalModels from "../_api/getLocalModels";

type GetLocalModelsResponse =
  paths["/v1/admin/models/local"]["get"]["responses"]["200"]["content"]["application/json"];

/**
 * 로컬 모델 목록 조회 훅
 * @param options - 추가 쿼리 옵션 (select, enabled, staleTime 등)
 */
export const useGetLocalModels = (
  options?: Omit<
    UseQueryOptions<GetLocalModelsResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetLocalModelsResponse, Error>({
    queryKey: ["admin", "models", "local"],
    queryFn: getLocalModels,
    ...options,
  });
};

export default useGetLocalModels;
