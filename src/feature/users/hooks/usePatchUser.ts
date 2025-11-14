"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import patchUser from "../api/patchUser";

type PatchUserRequest =
  paths["/api/v1/users/admin/user"]["patch"]["requestBody"]["content"]["application/json"];

type PatchUserResponse =
  paths["/api/v1/users/admin/user"]["patch"]["responses"]["200"]["content"]["application/json"];

export const usePatchUser = (
  options?: Omit<
    UseMutationOptions<PatchUserResponse, Error, PatchUserRequest>,
    "mutationFn"
  >
) => {
  return useMutation<PatchUserResponse, Error, PatchUserRequest>({
    mutationFn: (data: PatchUserRequest) => patchUser(data),
    ...options,
  });
};

export default usePatchUser;
