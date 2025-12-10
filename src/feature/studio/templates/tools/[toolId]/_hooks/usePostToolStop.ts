"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/tools";
import postToolStop from "../_api/postToolStop";

type PostToolStopParams =
  paths["/v1/mcp-tools/{tool_id}:stop"]["post"]["parameters"]["path"];

type PostToolStopRequest =
  paths["/v1/mcp-tools/{tool_id}:stop"]["post"]["requestBody"]["content"]["application/json"];

type PostToolStopResponse =
  paths["/v1/mcp-tools/{tool_id}:stop"]["post"]["responses"]["202"]["content"]["application/json"];

type PostToolStopVariables = {
  params: PostToolStopParams;
  data: PostToolStopRequest;
};

/**
 * MCP 도구 중지 훅
 * @param options - 추가 mutation 옵션 (onSuccess, onError, meta 등)
 * @description 특정 도구를 중지하는 mutation 훅입니다 (비동기 처리).
 */
export const usePostToolStop = (
  options?: Omit<
    UseMutationOptions<PostToolStopResponse, Error, PostToolStopVariables>,
    "mutationFn"
  >
) => {
  return useMutation<PostToolStopResponse, Error, PostToolStopVariables>({
    mutationFn: ({ params, data }: PostToolStopVariables) =>
      postToolStop(params, data),
    ...options,
  });
};

export default usePostToolStop;
