"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import postRolePrivilege from "../_api/postRolePrivilege";

type PostRolePrivilegeParams =
  paths["/api/v1/roles/{role_id}/privileges/{privilege_id}"]["post"]["parameters"]["path"];

type PostRolePrivilegeResponse =
  paths["/api/v1/roles/{role_id}/privileges/{privilege_id}"]["post"]["responses"]["200"]["content"]["application/json"];

export const usePostRolePrivilege = (
  options?: Omit<
    UseMutationOptions<
      PostRolePrivilegeResponse,
      Error,
      PostRolePrivilegeParams
    >,
    "mutationFn"
  >
) => {
  return useMutation<PostRolePrivilegeResponse, Error, PostRolePrivilegeParams>(
    {
      mutationFn: (params: PostRolePrivilegeParams) =>
        postRolePrivilege(params),
      ...options,
    }
  );
};

export default usePostRolePrivilege;
