"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/agents";
import deleteAgent from "../_api/deleteAgent";

type DeleteAgentParams =
  paths["/v1/agents/data/{agent_id}"]["delete"]["parameters"]["path"];

/**
 * 에이전트 삭제 훅
 * @param options - 추가 mutation 옵션 (onSuccess, onError, meta 등)
 * @description 에이전트 원본 데이터를 삭제하는 mutation 훅입니다. 관련된 마이페이지 항목들도 함께 삭제됩니다.
 */
export const useDeleteAgent = (
  options?: Omit<
    UseMutationOptions<void, Error, DeleteAgentParams>,
    "mutationFn"
  >
) => {
  return useMutation<void, Error, DeleteAgentParams>({
    mutationFn: (params: DeleteAgentParams) => deleteAgent(params),
    ...options,
  });
};

export default useDeleteAgent;
