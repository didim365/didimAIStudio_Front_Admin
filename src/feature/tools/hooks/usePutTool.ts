"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/tools";
import putTool from "../api/putTool";

type PutToolParams =
  paths["/v1/mcp-tools/{tool_id}"]["put"]["parameters"]["path"];

type PutToolRequest =
  paths["/v1/mcp-tools/{tool_id}"]["put"]["requestBody"]["content"]["application/json"];

type PutToolResponse =
  paths["/v1/mcp-tools/{tool_id}"]["put"]["responses"]["200"]["content"]["application/json"];

type PutToolVariables = {
  params: PutToolParams;
  data: PutToolRequest;
};

/**
 * MCP 도구 수정 훅
 * @param options - 추가 mutation 옵션 (onSuccess, onError, meta 등)
 * @description MCP 도구를 수정하는 mutation 훅입니다.
 */
export const usePutTool = (
  options?: Omit<
    UseMutationOptions<PutToolResponse, Error, PutToolVariables>,
    "mutationFn"
  >
) => {
  return useMutation<PutToolResponse, Error, PutToolVariables>({
    mutationFn: ({ params, data }: PutToolVariables) =>
      putTool(params, data),
    ...options,
  });
};

export default usePutTool;
