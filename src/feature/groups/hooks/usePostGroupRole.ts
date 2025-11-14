"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import postGroupRole from "../api/postGroupRole";

type PostGroupRoleParams =
  paths["/api/v1/roles/assign_role_to_group"]["post"]["parameters"]["query"];

type PostGroupRoleResponse =
  paths["/api/v1/roles/assign_role_to_group"]["post"]["responses"]["200"]["content"]["application/json"];

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
