"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { operations } from "@/shared/types/api/models";
import deleteCatalog from "../_api/deleteCatalog";

type DeleteCatalogParams =
  operations["delete_model_v1_catalog__model_id__delete"]["parameters"]["path"];

/**
 * AI 모델 카탈로그 삭제 훅
 * @param options - 추가 mutation 옵션 (onSuccess, onError, meta 등)
 * @description 특정 AI 모델 카탈로그를 삭제하는 mutation 훅입니다.
 */
export const useDeleteCatalog = (
  options?: Omit<
    UseMutationOptions<void, Error, DeleteCatalogParams>,
    "mutationFn"
  >
) => {
  return useMutation<void, Error, DeleteCatalogParams>({
    mutationFn: (params: DeleteCatalogParams) => deleteCatalog(params),
    ...options,
  });
};

export default useDeleteCatalog;
