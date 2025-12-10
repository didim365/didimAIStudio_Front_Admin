"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/tools";
import putToolConfig from "../_api/putToolConfig";

type PutToolConfigParams =
  paths["/v1/mcp-tools/{tool_id}/config"]["put"]["parameters"]["path"];

type PutToolConfigRequest =
  paths["/v1/mcp-tools/{tool_id}/config"]["put"]["requestBody"]["content"]["application/json"];

type PutToolConfigResponse =
  paths["/v1/mcp-tools/{tool_id}/config"]["put"]["responses"]["200"]["content"]["application/json"];

type PutToolConfigVariables = {
  params: PutToolConfigParams;
  data: PutToolConfigRequest;
};

/**
 * MCP 도구 설정 업데이트 훅
 * @param options - 추가 mutation 옵션 (onSuccess, onError, meta 등)
 * @description MCP 도구의 JSON 기반 확장 설정을 업데이트하는 mutation 훅입니다.
 */
export const usePutToolConfig = (
  options?: Omit<
    UseMutationOptions<
      PutToolConfigResponse,
      Error,
      PutToolConfigVariables
    >,
    "mutationFn"
  >
) => {
  return useMutation<
    PutToolConfigResponse,
    Error,
    PutToolConfigVariables
  >({
    mutationFn: ({ params, data }: PutToolConfigVariables) =>
      putToolConfig(params, data),
    ...options,
  });
};

export default usePutToolConfig;
