"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import postUser from "../_api/postUser";

type PostUserRequest =
  paths["/api/v1/users/admin/user"]["post"]["requestBody"]["content"]["application/json"];

type PostUserResponse =
  paths["/api/v1/users/admin/user"]["post"]["responses"]["201"]["content"]["application/json"];

export const usePostUser = (
  options?: Omit<
    UseMutationOptions<PostUserResponse, Error, PostUserRequest>,
    "mutationFn"
  >
) => {
  return useMutation<PostUserResponse, Error, PostUserRequest>({
    mutationFn: (data: PostUserRequest) => postUser(data),
    ...options,
  });
};

export default usePostUser;

