"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/tools";
import deleteUserConfig from "../_api/deleteUserConfig";

type DeleteUserConfigParams =
  paths["/v1/admin/user-configs/{config_id}"]["delete"]["parameters"]["path"];

/**
 * 사용자 설정 삭제 훅
 * @param options - 추가 mutation 옵션 (onSuccess, onError, meta 등)
 * @description 사용자 설정을 삭제하는 mutation 훅입니다.
 */
export const useDeleteUserConfig = (
  options?: Omit<
    UseMutationOptions<void, Error, DeleteUserConfigParams>,
    "mutationFn"
  >
) => {
  return useMutation<void, Error, DeleteUserConfigParams>({
    mutationFn: (params: DeleteUserConfigParams) => deleteUserConfig(params),
    ...options,
  });
};

export default useDeleteUserConfig;
