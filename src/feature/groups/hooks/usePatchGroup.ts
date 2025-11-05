"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import patchGroup from "../api/patchGroup";

type PatchGroupParams =
  paths["/api/v1/groups/{group_id}"]["patch"]["parameters"]["path"];

type PatchGroupRequest =
  paths["/api/v1/groups/{group_id}"]["patch"]["requestBody"]["content"]["application/json"];

type PatchGroupResponse =
  paths["/api/v1/groups/{group_id}"]["patch"]["responses"]["200"]["content"]["application/json"];

type PatchGroupVariables = {
  params: PatchGroupParams;
  data: PatchGroupRequest;
};

export const usePatchGroup = (
  options?: Omit<
    UseMutationOptions<PatchGroupResponse, Error, PatchGroupVariables>,
    "mutationFn"
  >
) => {
  return useMutation<PatchGroupResponse, Error, PatchGroupVariables>({
    mutationFn: ({ params, data }: PatchGroupVariables) =>
      patchGroup(params, data),
    ...options,
  });
};

export default usePatchGroup;
