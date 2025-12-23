"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { operations } from "@/shared/types/api/models";
import putCatalog from "../_api/putCatalog";

type PutCatalogParams =
  operations["update_model_v1_catalog__model_id__put"]["parameters"]["path"];

type PutCatalogRequest =
  operations["update_model_v1_catalog__model_id__put"]["requestBody"]["content"]["application/json"];

type PutCatalogResponse =
  operations["update_model_v1_catalog__model_id__put"]["responses"]["200"]["content"]["application/json"];

type PutCatalogVariables = {
  params: PutCatalogParams;
  data: PutCatalogRequest;
};

/**
 * AI 모델 카탈로그 수정 훅
 * @param options - 추가 mutation 옵션 (onSuccess, onError, meta 등)
 * @description 기존 AI 모델 카탈로그 정보를 수정하는 mutation 훅입니다.
 */
export const usePutCatalog = (
  options?: Omit<
    UseMutationOptions<PutCatalogResponse, Error, PutCatalogVariables>,
    "mutationFn"
  >
) => {
  return useMutation<PutCatalogResponse, Error, PutCatalogVariables>({
    mutationFn: ({ params, data }: PutCatalogVariables) =>
      putCatalog(params, data),
    ...options,
  });
};

export default usePutCatalog;
