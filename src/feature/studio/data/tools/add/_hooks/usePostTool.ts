"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/tools";
import postTool from "../_api/postTool";

type PostToolRequest =
  paths["/v1/mcp-tools/"]["post"]["requestBody"]["content"]["application/json"];

type PostToolResponse =
  paths["/v1/mcp-tools/"]["post"]["responses"]["201"]["content"]["application/json"];

/**
 * MCP 도구 등록 훅
 * @param options - 추가 mutation 옵션 (onSuccess, onError, meta 등)
 * @description 새로운 MCP 도구를 등록하는 mutation 훅입니다.
 */
export const usePostTool = (
  options?: Omit<
    UseMutationOptions<PostToolResponse, Error, PostToolRequest>,
    "mutationFn"
  >
) => {
  return useMutation<PostToolResponse, Error, PostToolRequest>({
    mutationFn: (data: PostToolRequest) => postTool(data),
    ...options,
  });
};

export default usePostTool;
