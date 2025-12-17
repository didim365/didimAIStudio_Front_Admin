"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/agents";
import putAgent from "../_api/putAgent";

type PutAgentParams =
  paths["/v1/agents/data/{agent_id}"]["put"]["parameters"]["path"];

type PutAgentRequest =
  paths["/v1/agents/data/{agent_id}"]["put"]["requestBody"]["content"]["application/json"];

type PutAgentResponse =
  paths["/v1/agents/data/{agent_id}"]["put"]["responses"]["200"]["content"]["application/json"];

type PutAgentVariables = {
  params: PutAgentParams;
  data: PutAgentRequest;
};

/**
 * 에이전트 데이터 수정 훅 (Upsert)
 * @param options - 추가 mutation 옵션 (onSuccess, onError, meta 등)
 * @description 에이전트 원본 데이터를 수정하는 mutation 훅입니다. 존재하지 않으면 새로 생성합니다.
 */
export const usePutAgent = (
  options?: Omit<
    UseMutationOptions<PutAgentResponse, Error, PutAgentVariables>,
    "mutationFn"
  >
) => {
  return useMutation<PutAgentResponse, Error, PutAgentVariables>({
    mutationFn: ({ params, data }: PutAgentVariables) => putAgent(params, data),
    ...options,
  });
};

export default usePutAgent;
