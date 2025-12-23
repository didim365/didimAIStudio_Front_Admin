"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/tools";
import putUserConfig from "../_api/putUserConfig";

type PutUserConfigParams =
  paths["/v1/admin/user-configs/{config_id}"]["put"]["parameters"]["path"];

type PutUserConfigRequest =
  paths["/v1/admin/user-configs/{config_id}"]["put"]["requestBody"]["content"]["application/json"];

type PutUserConfigResponse =
  paths["/v1/admin/user-configs/{config_id}"]["put"]["responses"]["200"]["content"]["application/json"];

type PutUserConfigVariables = {
  params: PutUserConfigParams;
  data: PutUserConfigRequest;
};

/**
 * 사용자 설정 수정 훅
 * @param options - 추가 mutation 옵션 (onSuccess, onError, meta 등)
 * @description 사용자 설정을 수정하는 mutation 훅입니다.
 */
export const usePutUserConfig = (
  options?: Omit<
    UseMutationOptions<PutUserConfigResponse, Error, PutUserConfigVariables>,
    "mutationFn"
  >
) => {
  return useMutation<PutUserConfigResponse, Error, PutUserConfigVariables>({
    mutationFn: ({ params, data }: PutUserConfigVariables) =>
      putUserConfig(params, data),
    ...options,
  });
};

export default usePutUserConfig;
