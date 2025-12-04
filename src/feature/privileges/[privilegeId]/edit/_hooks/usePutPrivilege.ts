"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import putPrivilege from "../_api/putPrivilege";

type PutPrivilegeParams =
  paths["/api/v1/roles/privileges/{privilege_id}"]["put"]["parameters"]["path"];

type PutPrivilegeRequest =
  paths["/api/v1/roles/privileges/{privilege_id}"]["put"]["requestBody"]["content"]["application/json"];

type PutPrivilegeResponse =
  paths["/api/v1/roles/privileges/{privilege_id}"]["put"]["responses"]["200"]["content"]["application/json"];

type PutPrivilegeVariables = {
  params: PutPrivilegeParams;
  data: PutPrivilegeRequest;
};

/**
 * 권한 수정 훅
 * @param options - 추가 mutation 옵션 (onSuccess, onError, meta 등)
 * @description 권한을 수정하는 mutation 훅입니다.
 */
export const usePutPrivilege = (
  options?: Omit<
    UseMutationOptions<PutPrivilegeResponse, Error, PutPrivilegeVariables>,
    "mutationFn"
  >
) => {
  return useMutation<PutPrivilegeResponse, Error, PutPrivilegeVariables>({
    mutationFn: ({ params, data }: PutPrivilegeVariables) =>
      putPrivilege(params, data),
    ...options,
  });
};

export default usePutPrivilege;
