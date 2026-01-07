"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import postGroupUser from "../_api/postGroupUser";

type PostGroupUserPathParams =
  paths["/api/v1/admin/groups/{group_id}/members"]["post"]["parameters"]["path"];

type PostGroupUserRequest =
  paths["/api/v1/admin/groups/{group_id}/members"]["post"]["requestBody"]["content"]["application/json"];

type PostGroupUserResponse =
  paths["/api/v1/admin/groups/{group_id}/members"]["post"]["responses"]["201"]["content"]["application/json"];

type PostGroupUserVariables = {
  params: PostGroupUserPathParams;
  data: PostGroupUserRequest;
};

export const usePostGroupUser = (
  options?: Omit<
    UseMutationOptions<PostGroupUserResponse, Error, PostGroupUserVariables>,
    "mutationFn"
  >
) => {
  return useMutation<PostGroupUserResponse, Error, PostGroupUserVariables>({
    mutationFn: ({ params, data }: PostGroupUserVariables) =>
      postGroupUser(params, data),
    ...options,
  });
};

export default usePostGroupUser;
