"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import postGroupRole from "../_api/postGroupRole";

type PostGroupRoleParams =
  paths["/api/v1/admin/groups/{group_id}/roles/{role_id}"]["post"]["parameters"]["path"];

type PostGroupRoleResponse =
  paths["/api/v1/admin/groups/{group_id}/roles/{role_id}"]["post"]["responses"]["201"]["content"]["application/json"];

export const usePostGroupRole = (
  options?: Omit<
    UseMutationOptions<PostGroupRoleResponse, Error, PostGroupRoleParams>,
    "mutationFn"
  >
) => {
  return useMutation<PostGroupRoleResponse, Error, PostGroupRoleParams>({
    mutationFn: (params: PostGroupRoleParams) => postGroupRole(params),
    ...options,
  });
};

export default usePostGroupRole;
