"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import deleteUser from "../_api/deleteUser";

type DeleteUserResponse =
  paths["/api/v1/admin/users/{user_id}"]["delete"]["responses"]["200"]["content"]["application/json"];

type DeleteUserParams =
  paths["/api/v1/admin/users/{user_id}"]["delete"]["parameters"]["path"];

export const useDeleteUser = (
  options?: Omit<
    UseMutationOptions<DeleteUserResponse, Error, DeleteUserParams>,
    "mutationFn"
  >
) => {
  return useMutation<DeleteUserResponse, Error, DeleteUserParams>({
    mutationFn: (params: DeleteUserParams) => deleteUser(params),
    ...options,
  });
};

export default useDeleteUser;
