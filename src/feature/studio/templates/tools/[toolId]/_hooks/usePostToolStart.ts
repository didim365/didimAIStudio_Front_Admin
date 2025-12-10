"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/tools";
import postToolStart from "../_api/postToolStart";

type PostToolStartParams =
  paths["/v1/mcp-tools/{tool_id}:start"]["post"]["parameters"]["path"];

type PostToolStartRequest =
  paths["/v1/mcp-tools/{tool_id}:start"]["post"]["requestBody"]["content"]["application/json"];

type PostToolStartResponse =
  paths["/v1/mcp-tools/{tool_id}:start"]["post"]["responses"]["202"]["content"]["application/json"];

type PostToolStartVariables = {
  params: PostToolStartParams;
  data: PostToolStartRequest;
};

/**
 * MCP 도구 시작 훅
 * @param options - 추가 mutation 옵션 (onSuccess, onError, meta 등)
 * @description 중지된 특정 도구를 시작하는 mutation 훅입니다 (비동기 처리).
 */
export const usePostToolStart = (
  options?: Omit<
    UseMutationOptions<PostToolStartResponse, Error, PostToolStartVariables>,
    "mutationFn"
  >
) => {
  return useMutation<PostToolStartResponse, Error, PostToolStartVariables>({
    mutationFn: ({ params, data }: PostToolStartVariables) =>
      postToolStart(params, data),
    ...options,
  });
};

export default usePostToolStart;
