"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/tools";
import putMcpToolConfig from "../api/putMcpToolConfig";

type PutMcpToolConfigParams =
  paths["/v1/mcp-tools/{tool_id}/config"]["put"]["parameters"]["path"];

type PutMcpToolConfigRequest =
  paths["/v1/mcp-tools/{tool_id}/config"]["put"]["requestBody"]["content"]["application/json"];

type PutMcpToolConfigResponse =
  paths["/v1/mcp-tools/{tool_id}/config"]["put"]["responses"]["200"]["content"]["application/json"];

type PutMcpToolConfigVariables = {
  params: PutMcpToolConfigParams;
  data: PutMcpToolConfigRequest;
};

/**
 * MCP 도구 설정 업데이트 훅
 * @param options - 추가 mutation 옵션 (onSuccess, onError, meta 등)
 * @description MCP 도구의 JSON 기반 확장 설정을 업데이트하는 mutation 훅입니다.
 */
export const usePutMcpToolConfig = (
  options?: Omit<
    UseMutationOptions<
      PutMcpToolConfigResponse,
      Error,
      PutMcpToolConfigVariables
    >,
    "mutationFn"
  >
) => {
  return useMutation<
    PutMcpToolConfigResponse,
    Error,
    PutMcpToolConfigVariables
  >({
    mutationFn: ({ params, data }: PutMcpToolConfigVariables) =>
      putMcpToolConfig(params, data),
    ...options,
  });
};

export default usePutMcpToolConfig;
