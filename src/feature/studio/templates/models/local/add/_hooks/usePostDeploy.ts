"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { operations } from "@/shared/types/api/models";
import postDeployLocal from "../_api/postDeploy";

// API 타입 추출
type PostDeployLocalRequest =
  operations["deploy_local_model_v1_admin_models_deploy_local_post"]["requestBody"]["content"]["application/json"];

type PostDeployLocalResponse =
  operations["deploy_local_model_v1_admin_models_deploy_local_post"]["responses"]["201"]["content"]["application/json"];

/**
 * 로컬 모델 배포 훅
 * @param options - 추가 mutation 옵션 (onSuccess, onError, meta 등)
 * @description GPUStack에 로컬 모델을 배포하는 mutation 훅입니다.
 */
export const usePostDeployLocal = (
  options?: Omit<
    UseMutationOptions<PostDeployLocalResponse, Error, PostDeployLocalRequest>,
    "mutationFn"
  >
) => {
  return useMutation<PostDeployLocalResponse, Error, PostDeployLocalRequest>({
    mutationFn: (data: PostDeployLocalRequest) => postDeployLocal(data),
    ...options,
  });
};

export default usePostDeployLocal;
