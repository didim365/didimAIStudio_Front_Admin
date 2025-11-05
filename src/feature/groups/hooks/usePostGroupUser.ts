"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import postGroupUser from "../api/postGroupUser";

type PostGroupUserRequest =
  paths["/api/v1/groups/user"]["post"]["requestBody"]["content"]["application/json"];

type PostGroupUserResponse =
  paths["/api/v1/groups/user"]["post"]["responses"]["200"]["content"]["application/json"];

export const usePostGroupUser = (
  options?: Omit<
    UseMutationOptions<PostGroupUserResponse, Error, PostGroupUserRequest>,
    "mutationFn"
  >
) => {
  return useMutation<PostGroupUserResponse, Error, PostGroupUserRequest>({
    mutationFn: (data: PostGroupUserRequest) => postGroupUser(data),
    ...options,
  });
};

export default usePostGroupUser;
