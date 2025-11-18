"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/tools";
import putMcpTool from "../api/putMcpTool";

type PutMcpToolParams =
  paths["/v1/mcp-tools/{tool_id}"]["put"]["parameters"]["path"];

type PutMcpToolRequest =
  paths["/v1/mcp-tools/{tool_id}"]["put"]["requestBody"]["content"]["application/json"];

type PutMcpToolResponse =
  paths["/v1/mcp-tools/{tool_id}"]["put"]["responses"]["200"]["content"]["application/json"];

type PutMcpToolVariables = {
  params: PutMcpToolParams;
  data: PutMcpToolRequest;
};

/**
 * MCP 도구 수정 훅
 * @param options - 추가 mutation 옵션 (onSuccess, onError, meta 등)
 * @description MCP 도구를 수정하는 mutation 훅입니다.
 */
export const usePutMcpTool = (
  options?: Omit<
    UseMutationOptions<PutMcpToolResponse, Error, PutMcpToolVariables>,
    "mutationFn"
  >
) => {
  return useMutation<PutMcpToolResponse, Error, PutMcpToolVariables>({
    mutationFn: ({ params, data }: PutMcpToolVariables) =>
      putMcpTool(params, data),
    ...options,
  });
};

export default usePutMcpTool;
