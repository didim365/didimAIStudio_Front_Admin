"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { operations } from "@/shared/types/api/models";
import deleteModel from "../_api/deleteModel";

/**
 * 모델 삭제 요청 파라미터 타입
 */
type DeleteModelParams = {
  model_id: number;
};

/**
 * 모델 삭제 응답 타입
 */
type DeleteModelResponse =
  operations["delete_model_v1_admin_models__model_id__delete"]["responses"]["200"]["content"]["application/json"];

/**
 * 모델 삭제 훅
 * @param options - 추가 mutation 옵션 (onSuccess, onError, meta 등)
 * @description GPUStack과 DB에서 모델을 삭제하는 mutation 훅입니다.
 */
export const useDeleteModel = (
  options?: Omit<
    UseMutationOptions<DeleteModelResponse, Error, DeleteModelParams>,
    "mutationFn"
  >
) => {
  return useMutation<DeleteModelResponse, Error, DeleteModelParams>({
    mutationFn: (params: DeleteModelParams) => deleteModel(params),
    ...options,
  });
};

export default useDeleteModel;
