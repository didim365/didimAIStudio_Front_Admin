"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import postPrivilege from "../api/postPrivilege";

type PostPrivilegesRequest =
  paths["/api/v1/roles/privileges"]["post"]["requestBody"]["content"]["application/json"];

type PostPrivilegesResponse =
  paths["/api/v1/roles/privileges"]["post"]["responses"]["200"]["content"]["application/json"];

export const usePostPrivilege = (
  options?: Omit<
    UseMutationOptions<PostPrivilegesResponse, Error, PostPrivilegesRequest>,
    "mutationFn"
  >
) => {
  return useMutation<PostPrivilegesResponse, Error, PostPrivilegesRequest>({
    mutationFn: (data: PostPrivilegesRequest) => postPrivilege(data),
    ...options,
  });
};

export default usePostPrivilege;
