"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { operations } from "@/shared/types/api/models";
import postSyncGPUStack from "../_api/postSyncGPUStack";

// API 타입 추출
type PostSyncGPUStackRequest =
  operations["sync_gpustack_deployments_v1_admin_models_sync_post"]["requestBody"]["content"]["application/json"];

type PostSyncGPUStackResponse =
  operations["sync_gpustack_deployments_v1_admin_models_sync_post"]["responses"]["200"]["content"]["application/json"];

/**
 * GPUStack 배포 동기화 훅
 * @param options - 추가 mutation 옵션 (onSuccess, onError, meta 등)
 * @description GPUStack에 배포된 모델을 로컬 DB와 동기화하는 mutation 훅입니다.
 */
export const useSyncGPUStack = (
  options?: Omit<
    UseMutationOptions<PostSyncGPUStackResponse, Error, PostSyncGPUStackRequest>,
    "mutationFn"
  >
) => {
  return useMutation<PostSyncGPUStackResponse, Error, PostSyncGPUStackRequest>({
    mutationFn: (data: PostSyncGPUStackRequest) => postSyncGPUStack(data),
    ...options,
  });
};

export default useSyncGPUStack;
