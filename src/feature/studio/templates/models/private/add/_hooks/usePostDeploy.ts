"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { operations } from "@/shared/types/api/models";
import postDeploy from "../_api/postDeploy";

// API 타입 추출
type PostDeployRequest =
  operations["deploy_model_v1_models_deploy_post"]["requestBody"]["content"]["application/json"];

type PostDeployResponse =
  operations["deploy_model_v1_models_deploy_post"]["responses"]["200"]["content"]["application/json"];

/**
 * 모델 배포 훅
 * @param options - 추가 mutation 옵션 (onSuccess, onError, meta 등)
 * @description GPUStack에 모델을 배포하는 mutation 훅입니다.
 */
export const usePostDeploy = (
  options?: Omit<
    UseMutationOptions<PostDeployResponse, Error, PostDeployRequest>,
    "mutationFn"
  >
) => {
  return useMutation<PostDeployResponse, Error, PostDeployRequest>({
    mutationFn: (data: PostDeployRequest) => postDeploy(data),
    ...options,
  });
};

export default usePostDeploy;
