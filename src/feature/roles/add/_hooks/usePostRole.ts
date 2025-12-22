"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import postRole from "../_api/postRole";

type PostRoleRequest =
  paths["/api/v1/roles/"]["post"]["requestBody"]["content"]["application/json"];

type PostRoleResponse =
  paths["/api/v1/roles/"]["post"]["responses"]["200"]["content"]["application/json"];

export const usePostRole = (
  options?: Omit<
    UseMutationOptions<PostRoleResponse, Error, PostRoleRequest>,
    "mutationFn"
  >
) => {
  return useMutation<PostRoleResponse, Error, PostRoleRequest>({
    mutationFn: (data: PostRoleRequest) => postRole(data),
    ...options,
  });
};

export default usePostRole;
