"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/tools";
import postToolDeploy from "../_api/postToolDeploy";

type PostToolDeployParams =
  paths["/v1/mcp-tools/{tool_id}:deploy"]["post"]["parameters"]["path"];

type PostToolDeployRequest =
  paths["/v1/mcp-tools/{tool_id}:deploy"]["post"]["requestBody"]["content"]["application/json"];

type PostToolDeployResponse =
  paths["/v1/mcp-tools/{tool_id}:deploy"]["post"]["responses"]["202"]["content"]["application/json"];

type PostToolDeployVariables = {
  params: PostToolDeployParams;
  data: PostToolDeployRequest;
};

/**
 * MCP 도구 배포 훅 (레거시)
 * @param options - 추가 mutation 옵션 (onSuccess, onError, meta 등)
 * @description 특정 도구를 배포하는 mutation 훅입니다 (비동기 처리).
 *              ⚠️ 레거시 API: 이 엔드포인트는 하위 호환성을 위해 유지됩니다.
 *              새로운 멀티유저 환경에서는 admin 사용자의 'default' 설정으로 자동 처리됩니다.
 */
export const usePostDeployTool = (
  options?: Omit<
    UseMutationOptions<PostToolDeployResponse, Error, PostToolDeployVariables>,
    "mutationFn"
  >
) => {
  return useMutation<PostToolDeployResponse, Error, PostToolDeployVariables>({
    mutationFn: ({ params, data }: PostToolDeployVariables) =>
      postToolDeploy(params, data),
    ...options,
  });
};

export default usePostDeployTool;
