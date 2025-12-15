"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/models";
import postCatalog from "../_api/postCatalog";

type PostCatalogRequest =
  paths["/v1/catalog/"]["post"]["requestBody"]["content"]["application/json"];

type PostCatalogResponse =
  paths["/v1/catalog/"]["post"]["responses"]["200"]["content"]["application/json"];

/**
 * AI 모델 카탈로그 생성 훅
 * @param options - 추가 mutation 옵션 (onSuccess, onError, meta 등)
 * @description 새로운 AI 모델을 카탈로그에 등록하는 mutation 훅입니다.
 */
export const usePostCatalog = (
  options?: Omit<
    UseMutationOptions<PostCatalogResponse, Error, PostCatalogRequest>,
    "mutationFn"
  >
) => {
  return useMutation<PostCatalogResponse, Error, PostCatalogRequest>({
    mutationFn: (data: PostCatalogRequest) => postCatalog(data),
    ...options,
  });
};

export default usePostCatalog;
