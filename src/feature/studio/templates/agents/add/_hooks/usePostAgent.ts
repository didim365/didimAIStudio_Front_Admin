"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/agents";
import postAgent from "../_api/postAgent";

type PostAgentRequest =
  paths["/v1/agents/data"]["post"]["requestBody"]["content"]["application/json"];

type PostAgentResponse =
  paths["/v1/agents/data"]["post"]["responses"]["201"]["content"]["application/json"];

/**
 * 에이전트 데이터 생성 훅
 * @param options - 추가 mutation 옵션 (onSuccess, onError, meta 등)
 * @description 새로운 에이전트 원본 데이터를 생성하는 mutation 훅입니다.
 */
export const usePostAgent = (
  options?: Omit<
    UseMutationOptions<PostAgentResponse, Error, PostAgentRequest>,
    "mutationFn"
  >
) => {
  return useMutation<PostAgentResponse, Error, PostAgentRequest>({
    mutationFn: (data: PostAgentRequest) => postAgent(data),
    ...options,
  });
};

export default usePostAgent;
