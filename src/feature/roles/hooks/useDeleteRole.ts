"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import deleteRole from "../api/deleteRole";

type DeleteRoleParams =
  paths["/api/v1/roles/{role_id}"]["delete"]["parameters"]["path"];

export const useDeleteRole = (
  options?: Omit<
    UseMutationOptions<void, Error, DeleteRoleParams>,
    "mutationFn"
  >
) => {
  return useMutation<void, Error, DeleteRoleParams>({
    mutationFn: (params: DeleteRoleParams) => deleteRole(params),
    ...options,
  });
};

export default useDeleteRole;
