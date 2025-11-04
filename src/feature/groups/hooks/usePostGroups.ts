"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import postGroups from "../api/postGroups";

type PostGroupsRequest =
  paths["/api/v1/groups"]["post"]["requestBody"]["content"]["application/json"];

type PostGroupsResponse =
  paths["/api/v1/groups"]["post"]["responses"]["201"]["content"]["application/json"];

export const usePostGroups = (
  options?: Omit<
    UseMutationOptions<PostGroupsResponse, Error, PostGroupsRequest>,
    "mutationFn"
  >
) => {
  return useMutation<PostGroupsResponse, Error, PostGroupsRequest>({
    mutationFn: (data: PostGroupsRequest) => postGroups(data),
    ...options,
  });
};

export default usePostGroups;
